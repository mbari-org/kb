import { getHistory } from '@/lib/kb/api/history'
import {
  getNames as fetchNames,
  getRanks as fetchRanks,
  getRoot as fetchRoot,
} from '@/lib/kb/api/taxonomy'

import { filterRanks } from '@/lib/kb/model/rank'

import {
  addedConcepts,
  loadChildren,
  loadConcept,
  loadConceptData,
  loadParent,
  refresh as refreshConcept,
} from './concept'

import { treeItem } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'

const buildTree = taxonomy => {
  const treeItems = concept => {
    const item = treeItem(concept)
    item.children = concept.children?.map(child => treeItems(taxonomy.conceptMap[child])) || []
    return item
  }

  const taxonomyTree = treeItems(taxonomy.conceptMap[taxonomy.rootName])

  return taxonomyTree
}

const deleteConcept = async (taxonomy, conceptName, apiFns) => {
  const concept = getConcept(taxonomy, conceptName)
  if (!concept) {
    throw new Error(`Concept "${conceptName}" not found in the taxonomy.`)
  }
  if (0 < concept.children.length) {
    throw new Error(`Concept "${conceptName}" has children.`)
  }

  const conceptMap = { ...taxonomy.conceptMap }
  delete conceptMap[conceptName]

  const aliasMap = { ...taxonomy.aliasMap }
  if (0 < concept.alternateNames.length) {
    concept.alternateNames.forEach(alternateName => {
      delete aliasMap[alternateName]
    })
  }

  const parent = { ...getConcept(taxonomy, concept.parent) }
  const conceptChildIndex = parent.children.indexOf(conceptName)

  parent.children = parent.children.filter(child => child !== conceptName)
  mapConcept(parent, conceptMap, aliasMap)

  let selectConceptName
  if (parent.children.length === 0) {
    selectConceptName = parent.name
  } else if (conceptChildIndex === 0) {
    selectConceptName = parent.children[0]
  } else {
    selectConceptName = parent.children[conceptChildIndex - 1]
  }

  const [names, pending] = await Promise.all([
    apiFns.apiPayload(fetchNames),
    apiFns.apiPagination(getHistory, ['pending']),
  ])

  const updatedTaxonomy = {
    ...taxonomy,
    aliasMap,
    conceptMap,
    names,
    pending,
  }

  return { taxonomy: updatedTaxonomy, selectConceptName }
}

const descendants = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  if (!concept) return []

  const allDescendants = []
  const processChildren = children => {
    children.forEach(child => {
      const childConcept = getConcept(taxonomy, child)
      allDescendants.push(childConcept)
      if (childConcept.children?.length > 0) {
        processChildren(childConcept.children)
      }
    })
  }

  processChildren(concept.children)
  return allDescendants
}

const filterTaxonomyRanks = (taxonomy, field, otherValue) =>
  filterRanks(taxonomy.ranks, field, otherValue)

const getConcept = (taxonomy, conceptName) => {
  return taxonomy?.conceptMap[conceptName] || taxonomy?.aliasMap[conceptName] || null
}

const getConceptPrimaryName = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return concept?.name
}

const getNames = taxonomy => taxonomy?.names

const getPendingHistory = (taxonomy, conceptName) =>
  conceptName
    ? taxonomy.pending.filter(history => history.concept === conceptName)
    : taxonomy.pending

const getRoot = (conceptMap, rootName) => conceptMap[rootName]

const isConceptLoaded = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return (
    concept &&
    concept.aliases &&
    concept.children &&
    concept.children.every(child => taxonomy.conceptMap[child].children) &&
    (concept.name === taxonomy.rootName || concept.parent)
  )
}

const isDescendant = (taxonomy, conceptName, descendantName) => {
  const concept = getConcept(taxonomy, conceptName)
  if (!concept) {
    return false
  }
  if (concept.name === descendantName) {
    return true
  }
  return concept.children.some(child => isDescendant(taxonomy, child, descendantName))
}

const isRoot = (taxonomy, concept) => concept.name === taxonomy.rootName

const loadTaxonomy = async apiFns => {
  const [root, names, ranks, pending] = await Promise.all([
    apiFns.apiPayload(fetchRoot),
    apiFns.apiPayload(fetchNames),
    apiFns.apiPayload(fetchRanks),
    apiFns.apiPagination(getHistory, ['pending']),
  ])

  const rootConcept = await loadConcept(root.name, apiFns.apiPayload)

  const aliasMap = rootConcept.aliases.reduce((acc, alias) => {
    acc[alias.name] = rootConcept
    return acc
  }, {})
  const conceptMap = { [rootConcept.name]: rootConcept }

  const taxonomy = {
    aliasMap,
    conceptMap,
    names,
    pending,
    ranks,
    rootName: rootConcept.name,
  }

  return { taxonomy }
}

// Taxonomy concepts are look-ahead loaded for tree display.
const loadTaxonomyConcept = async (taxonomy, conceptName, apiPayload) => {
  const updatedTaxonomy = {
    ...taxonomy,
    conceptMap: { ...taxonomy.conceptMap },
    aliasMap: { ...taxonomy.aliasMap },
  }

  const conceptMap = updatedTaxonomy.conceptMap
  const aliasMap = updatedTaxonomy.aliasMap

  const taxonomyConcept = getConcept(taxonomy, conceptName)
  const concept = taxonomyConcept
    ? { ...taxonomyConcept }
    : await loadConcept(conceptName, apiPayload)

  if (!concept.aliases) {
    await loadConceptData(concept, apiPayload)
  }

  // If the concept already has children, we only need to load the concept's grand children. This is
  //  typical when a child concept is selected.
  if (concept?.children) {
    await Promise.all(
      concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiPayload))
    )
    mapConcept(concept, conceptMap, aliasMap)
    return { taxonomy: updatedTaxonomy }
  }

  // Load the concept's children
  const children = await loadChildren(concept.name, apiPayload)
  concept.children = children.map(child => child.name)
  children.forEach(child => {
    mapConcept(child, conceptMap, aliasMap)
  })

  // Load the concept's grandchildren
  await Promise.all(
    concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiPayload))
  )

  // If the concept is the root, we're done.
  if (isRoot(taxonomy, concept)) {
    mapConcept(concept, conceptMap, aliasMap)
    return { taxonomy: updatedTaxonomy }
  }

  // We're loading a concept the taxonomy knows nothing about (from either a name search or an
  //  initial loading of saved state). To load and connect the concept into the tree, build a chain
  //  of concept names from the concept to the root. For concepts in the chain but not in the
  //  taxonomy, fetch the parent to get the necessary name. Then walk the chain from the top and
  //  load each concept, children and grandchildren not already loaded.

  let nextAncestor = await loadParent(concept.name, apiPayload)
  concept.parent = nextAncestor.name
  const conceptAncestry = [concept.name]

  while (!updatedTaxonomy.conceptMap[nextAncestor.name]) {
    conceptAncestry.push(nextAncestor.name)
    nextAncestor = await loadParent(nextAncestor.name, apiPayload)
  }
  conceptAncestry.push(nextAncestor.name)

  while (!isRoot(taxonomy, nextAncestor)) {
    const parent = await loadParent(nextAncestor.name, apiPayload)
    nextAncestor = updatedTaxonomy.conceptMap[parent.name]
    conceptAncestry.push(nextAncestor.name)
  }
  conceptAncestry.reverse()

  for (const name of conceptAncestry) {
    const children = await loadTaxonomyConceptChildren(updatedTaxonomy, name, apiPayload)
    await Promise.all(
      children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiPayload))
    )
  }

  // Wait until here to map the primary loaded concept (by conceptName) since the above processing
  // may have loaded that concept as a child of its parent and we would lose the "extra" data
  // (aliases, etc) that we already loaded for it.
  mapConcept(concept, conceptMap, aliasMap)

  return { taxonomy: updatedTaxonomy }
}

const loadTaxonomyConceptChildren = async (updatableTaxonomy, conceptName, apiPayload) => {
  const concept = getConcept(updatableTaxonomy, conceptName)

  const conceptMap = updatableTaxonomy.conceptMap
  const aliasMap = updatableTaxonomy.aliasMap

  if (concept && !concept.children) {
    const updatedConcept = { ...concept }
    const children = await loadChildren(concept.name, apiPayload)
    updatedConcept.children = children.map(child => child.name)
    children.forEach(child => {
      mapConcept(child, conceptMap, aliasMap)
    })
    mapConcept(updatedConcept, conceptMap, aliasMap)
    return updatedConcept.children
  }

  return concept.children
}

const loadTaxonomyConceptDescendants = async (taxonomy, concept, apiPayload) => {
  const updatedTaxonomy = {
    ...taxonomy,
    conceptMap: { ...taxonomy.conceptMap },
    aliasMap: { ...taxonomy.aliasMap },
  }
  const descendants = [...concept.children]

  const conceptMap = updatedTaxonomy.conceptMap
  const aliasMap = updatedTaxonomy.aliasMap

  while (0 < descendants.length) {
    const descendantName = descendants.shift()
    const descendant = getConcept(updatedTaxonomy, descendantName)

    if (!descendant) {
      throw new Error(`Concept not found in taxonomy: ${descendantName}`)
    }

    if (descendant && !descendant.children) {
      const children = await loadChildren(descendant.name, apiPayload)
      const updatedDescendant = {
        ...descendant,
        children: children.map(c => c.name),
      }

      mapConcept(updatedDescendant, conceptMap, aliasMap)

      children.forEach(child => {
        descendants.push(child.name)
        const updatedChild = {
          ...child,
          parent: descendantName,
        }
        mapConcept(updatedChild, conceptMap, aliasMap)
      })
    } else if (descendant?.children) {
      descendants.push(...descendant.children)
    }
  }

  return { taxonomy: updatedTaxonomy }
}

const mapConcept = (concept, conceptMap, aliasMap) => {
  conceptMap[concept.name] = concept
  concept.alternateNames.forEach(alternateName => {
    aliasMap[alternateName] = concept
  })
}

const refreshTaxonomyConcept = async (taxonomy, concept, updateInfo, apiFns) => {
  const { hasUpdated } = updateInfo

  const conceptMap = { ...taxonomy.conceptMap }
  const aliasMap = { ...taxonomy.aliasMap }

  const updatedConcept = await refreshConcept(concept, updateInfo, apiFns.apiPayload)
  mapConcept(updatedConcept, conceptMap, aliasMap)

  const structureChanged = ['aliases', 'children', 'name', 'parent'].some(field =>
    hasUpdated(field)
  )

  if (!structureChanged) {
    const updatedTaxonomy = {
      ...taxonomy,
      conceptMap,
    }
    return { concept: updatedConcept, taxonomy: updatedTaxonomy }
  }

  if (hasUpdated('aliases')) {
    concept.aliases
      .filter(alias => !updatedConcept.aliases.includes(alias))
      .forEach(alias => delete aliasMap[alias.name])

    updatedConcept.aliases.forEach(alias => {
      aliasMap[alias.name] = updatedConcept
    })
  }

  if (hasUpdated('children')) {
    addedConcepts(updatedConcept.name, updateInfo).forEach(child => {
      mapConcept(child, conceptMap, aliasMap)
    })
  }

  if (hasUpdated('name')) {
    delete conceptMap[concept.name]

    const parentConcept = { ...conceptMap[updatedConcept.parent] }
    parentConcept.children = parentConcept.children
      .filter(child => child !== concept.name)
      .concat(updatedConcept.name)
      .sort()

    mapConcept(parentConcept, conceptMap, aliasMap)
  }

  if (hasUpdated('parent')) {
    const priorParentConcept = { ...taxonomy.conceptMap[concept.parent] }
    priorParentConcept.children = priorParentConcept.children.filter(
      child => child !== updatedConcept.name
    )
    mapConcept(priorParentConcept, conceptMap, aliasMap)

    const parentConcept = { ...conceptMap[updatedConcept.parent] }
    parentConcept.children = [...parentConcept.children, updatedConcept.name].sort()
    mapConcept(parentConcept, conceptMap, aliasMap)
  }

  const [updatedNames, pending] = await Promise.all([
    apiFns.apiPayload(fetchNames),
    apiFns.apiPagination(getHistory, ['pending']),
  ])

  const updatedTaxonomy = {
    ...taxonomy,
    aliasMap,
    conceptMap,
    names: updatedNames,
    pending,
  }

  return { concept: updatedConcept, taxonomy: updatedTaxonomy }
}

const refreshHistory = async (taxonomy, historyType, apiFns) => {
  const data = await apiFns.apiPagination(getHistory, [historyType])
  return { taxonomy: { ...taxonomy, [historyType]: data } }
}

export const cxDebugTaxonomyIntegrity = taxonomy => {
  const conceptMap = taxonomy.conceptMap
  const aliasMap = taxonomy.aliasMap

  const conceptError = (concept, reason) => {
    throw new Error(`Concept "${concept.name}" ${reason}`)
  }

  const validateConcept = conceptName => {
    const concept = conceptMap[conceptName]
    if (!concept) {
      conceptError(conceptName, 'is not in the concept map')
    }

    concept.alternateNames.forEach(alternateName => {
      if (!aliasMap[alternateName]) {
        conceptError(concept, `has alias "${alternateName}" that is not in aliasMap`)
      }
      if (concept !== aliasMap[alternateName]) {
        conceptError(
          concept,
          `in the conceptMap is not the concept "${alternateName}" in the aliasMap`
        )
      }
    })

    concept.children?.forEach(child => {
      const childConcept = conceptMap[child]
      if (!childConcept) {
        conceptError(concept, `has child "${child}" that is not in conceptMap`)
      }
      const childConceptParent = conceptMap[childConcept.parent]
      if (!childConceptParent) {
        conceptError(concept, `has parent "${childConcept.parent}" that is not in conceptMap`)
      }
      if (childConceptParent !== concept) {
        conceptError(concept, `has child "${child.name}" that does not have concept as parent`)
      }
    })

    if (!concept.parent && !isRoot(taxonomy, concept)) {
      conceptError(concept, 'has no parent')
    }
  }

  const validateConceptTree = concept => {
    validateConcept(concept)
    concept.children?.forEach(child => {
      validateConceptTree(child)
    })
  }

  validateConceptTree(taxonomy.rootName)
  console.log('cxDebugTaxonomyIntegrity passed')
}

export {
  buildTree,
  deleteConcept,
  descendants,
  filterTaxonomyRanks,
  getConcept,
  getConceptPrimaryName,
  getNames,
  getPendingHistory,
  getRoot,
  isConceptLoaded,
  isDescendant,
  isRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  refreshHistory,
  refreshTaxonomyConcept,
}
