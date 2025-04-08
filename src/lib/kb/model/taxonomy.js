import { fetchHistory } from '@/lib/kb/api/history'
import { fetchNames, fetchRanks, fetchRoot } from '@/lib/kb/api/taxonomy'

import { filterRanks } from '@/lib/kb/conceptState/rank'

import {
  addedConcepts,
  loadChildren,
  loadConcept,
  loadConceptData,
  loadParent,
  refresh as refreshConcept,
} from './concept'

import { treeItem } from '@/components/kb/panels/concepts/tree/lib/taxonomyItem'

// const addChild = (updatableConcepts, updatableRoot, updatableChild) => {
//   const updatableParent = { ...updatableChild.parent }
//   addChildConcept(updatableParent, updatableChild)

//   const conceptParentInRoot = findConcept(updatableRoot, updatableParent.name)
//   conceptParentInRoot.children = updatableParent.children

//   updatableConcepts[updatableChild.name] = updatableChild
//   updatableRoot[updatableParent.name] = updatableParent
// }

const buildTree = taxonomy => {
  const treeItems = concept => {
    const item = treeItem(concept)
    item.children = concept.children?.map(child => treeItems(taxonomy.conceptMap[child])) || []
    return item
  }

  const taxonomyTree = treeItems(taxonomy.conceptMap[taxonomy.rootName])

  return taxonomyTree
}

const deleteConcept = async (taxonomy, conceptName, apiPayload) => {
  const concept = getConcept(taxonomy, conceptName)
  if (!concept) {
    throw new Error(`Concept "${conceptName}" not found in the taxonomy.`)
  }
  if (0 < concept.children.length) {
    throw new Error(`Concept "${conceptName}" has children.`)
  }

  const conceptMap = { ...taxonomy.conceptMap }
  delete conceptMap[conceptName]

  let aliasMap = taxonomy.aliasMap
  if (0 < concept.alternateNames.length) {
    aliasMap = { ...taxonomy.aliasMap }
    concept.alternateNames.forEach(alternateName => {
      delete aliasMap[alternateName]
    })
  }

  const parent = { ...getConcept(taxonomy, concept.parent) }
  const conceptChildIndex = parent.children.indexOf(conceptName)

  parent.children = parent.children.filter(child => child !== conceptName)
  conceptMap[parent.name] = parent

  let selectConceptName
  if (parent.children.length === 0) {
    selectConceptName = parent.name
  } else if (conceptChildIndex === 0) {
    selectConceptName = parent.children[0]
  } else {
    selectConceptName = parent.children[conceptChildIndex - 1]
  }

  const names = await apiPayload(fetchNames)

  const updatedTaxonomy = {
    ...taxonomy,
    aliasMap,
    conceptMap,
    names,
  }

  return { taxonomy: updatedTaxonomy, selectConceptName }
}

const filterTaxonomyRanks = (taxonomy, field, otherValue) =>
  filterRanks(taxonomy.ranks, field, otherValue)

const getConcept = (taxonomy, conceptName) => {
  return taxonomy?.conceptMap[conceptName] || taxonomy?.aliasMap[conceptName] || null
}

const getNames = taxonomy => taxonomy?.names

const getConceptPendingHistory = (taxonomy, conceptName) =>
  taxonomy.pendingHistory.filter(history => history.concept === conceptName)

const getConceptPrimaryName = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return concept?.name
}

const getRoot = (conceptMap, rootName) => conceptMap[rootName]

const isConceptLoaded = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return (
    concept && concept.aliases && concept.annotations && isConceptTreeReady(taxonomy, conceptName)
  )
}

const isConceptTreeReady = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return (
    concept &&
    concept.children &&
    concept.children.every(child => taxonomy.conceptMap[child].children) &&
    (concept.name === taxonomy.rootName || concept.parent)
  )
}

const isRoot = (taxonomy, concept) => concept.name === taxonomy.rootName

const loadTaxonomy = async apiPayload => {
  const [root, names, ranks, { approvedHistory, pendingHistory }] = await Promise.all([
    apiPayload(fetchRoot),
    apiPayload(fetchNames),
    apiPayload(fetchRanks),
    loadTaxonomyHistory(apiPayload),
  ])

  const rootConcept = await loadConcept(root.name, apiPayload)

  // const shellTaxonomy = {
  //   aliasMap: {},
  //   conceptMap: { [rootConcept.name]: rootConcept },
  //   rootName: rootConcept.name,
  // }

  // const { taxonomy: loadedMapsTaxonomy } = await loadTaxonomyConcept(
  //   shellTaxonomy,
  //   rootConcept.name,
  //   apiPayload
  // )

  const aliasMap = rootConcept.aliases.reduce((acc, alias) => {
    acc[alias.name] = rootConcept
    return acc
  }, {})
  const conceptMap = { [rootConcept.name]: rootConcept }

  const taxonomy = {
    aliasMap,
    approvedHistory,
    conceptMap,
    names,
    pendingHistory,
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

  const taxonomyConcept = getConcept(taxonomy, conceptName)
  const concept = taxonomyConcept
    ? { ...taxonomyConcept }
    : await loadConcept(conceptName, apiPayload)
  mapConcept(updatedTaxonomy, concept)

  // If the concept already has children, we only need to load the concept's grand children. This is
  //  typical when a concept's child is selected.
  if (concept?.children) {
    await Promise.all(
      concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiPayload))
    )
    await loadConceptData(concept, apiPayload)
    return { taxonomy: updatedTaxonomy }
  }

  // Load the concept's children
  const children = await loadChildren(concept.name, apiPayload)
  concept.children = children.map(child => child.name)
  children.forEach(child => {
    mapConcept(updatedTaxonomy, child)
  })

  // Load the concept's grandchildren
  await Promise.all(
    concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiPayload))
  )

  // If the concept is the root, we're done.
  if (isRoot(taxonomy, concept)) {
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

  return { taxonomy: updatedTaxonomy }
}

const loadTaxonomyConceptChildren = async (taxonomy, conceptName, apiPayload) => {
  const concept = getConcept(taxonomy, conceptName)

  if (concept && !concept.children) {
    const updatedConcept = { ...concept }
    const children = await loadChildren(concept.name, apiPayload)
    updatedConcept.children = children.map(child => child.name)
    children.forEach(child => {
      mapConcept(taxonomy, child)
    })
    mapConcept(taxonomy, updatedConcept)
    return updatedConcept.children
  }

  return concept.children
}

const loadTaxonomyConceptDescendants = async (taxonomy, concept, apiPayload) => {
  const updatedTaxonomy = { ...taxonomy }
  const descendants = [...concept.children]

  while (0 < descendants.length) {
    const descendantName = descendants.shift()
    const descendant = getConcept(updatedTaxonomy, descendantName)

    if (!descendant) {
      throw new Error(`Concept not found in taxonomy: ${descendantName}`)
    }

    if (descendant && !descendant.children) {
      console.log('descendant:', descendant)
      const children = await loadChildren(descendant.name, apiPayload)
      descendant.children = children.map(c => c.name)
      console.log('descendant children:', children)
      children.reduce((acc, c) => {
        mapConcept(updatedTaxonomy, c)
        if (c.name === '') {
          console.log('descendant has empty child:', descendant)
        }

        acc.push(c.name)
        return acc
      }, descendants)
      mapConcept(updatedTaxonomy, descendant)
    } else if (descendant?.children) {
      descendants.push(...descendant.children)
    }
  }

  return { taxonomy: updatedTaxonomy }
}

const loadTaxonomyHistory = async apiPayload => {
  const [approvedHistory, pendingHistory] = await Promise.all([
    apiPayload(fetchHistory, 'approved'),
    apiPayload(fetchHistory, 'pending'),
  ])
  return {
    approvedHistory,
    pendingHistory,
  }
}

const mapConcept = (taxonomy, concept) => {
  taxonomy.conceptMap[concept.name] = concept
  concept.alternateNames.forEach(alternateName => {
    taxonomy.aliasMap[alternateName] = concept
  })
}

// CxRemove
const mapsFromConcept = (topConcept, aliasMapOnly = false) => {
  const aliasMap = {}
  const conceptMap = {}

  const buildMaps = concept => {
    if (!aliasMapOnly) {
      conceptMap[concept.name] = concept
    }
    concept.alternateNames.forEach(alternateName => {
      aliasMap[alternateName] = concept
    })

    if (concept.children) {
      concept.children.forEach(child => buildMaps(child))
    }
  }

  buildMaps(topConcept)
  return { aliasMap, conceptMap }
}

const refreshTaxonomyConcept = async (taxonomy, concept, updateInfo, results, apiPayload) => {
  const { hasUpdated } = updateInfo

  const updatedConcept = await refreshConcept(concept, updateInfo, results, apiPayload)
  const conceptMap = { ...taxonomy.conceptMap }
  conceptMap[updatedConcept.name] = updatedConcept

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

  const aliasMap = { ...taxonomy.aliasMap }

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
      conceptMap[child.name] = child
    })
  }

  if (hasUpdated('name')) {
    delete conceptMap[concept.name]
    conceptMap[updatedConcept.name] = updatedConcept

    const parentConcept = { ...conceptMap[updatedConcept.parent] }
    parentConcept.children = parentConcept.children
      .filter(child => child !== concept.name)
      .concat(updatedConcept.name)
      .sort()

    conceptMap[parentConcept.name] = parentConcept
  }

  if (hasUpdated('parent')) {
    const priorParentConcept = { ...taxonomy.conceptMap[concept.parent] }
    priorParentConcept.children = priorParentConcept.children.filter(
      child => child !== updatedConcept.name
    )
    conceptMap[priorParentConcept.name] = priorParentConcept

    const parentConcept = { ...conceptMap[updatedConcept.parent] }
    parentConcept.children = [...parentConcept.children, updatedConcept.name].sort()
    conceptMap[parentConcept.name] = parentConcept
  }

  const updatedNames = await apiPayload(fetchNames)

  const updatedTaxonomy = {
    ...taxonomy,
    aliasMap,
    conceptMap,
    names: updatedNames,
  }

  return { concept: updatedConcept, taxonomy: updatedTaxonomy }
}

const refreshTaxonomyHistory = async (apiPayload, updatableTaxonomy) => {
  const [approvedHistory, pendingHistory] = await Promise.all([
    apiPayload(fetchHistory, 'approved'),
    apiPayload(fetchHistory, 'pending'),
  ])
  updatableTaxonomy.approvedHistory = approvedHistory
  updatableTaxonomy.pendingHistory = pendingHistory
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
        conceptError(concept, `aliasMap "${alternateName}" is not the concept`)
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
  filterTaxonomyRanks,
  getConcept,
  getConceptPendingHistory,
  getConceptPrimaryName,
  getNames,
  getRoot,
  isConceptLoaded,
  isConceptTreeReady,
  isRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  mapsFromConcept,
  refreshTaxonomyConcept,
  refreshTaxonomyHistory,
}
