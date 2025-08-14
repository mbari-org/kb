import {
  deleteConcept as apiDeleteConcept,
  getConceptChildren as fetchChildren,
  getConcept as fetchConcept,
  getConceptNames as fetchConceptNames,
  getConceptParent as fetchParent,
} from '@/lib/api/concept'

import {
  getNames as fetchNames,
  getRanks as fetchRanks,
  getRoot as fetchRoot,
} from '@/lib/api/taxonomy'

import { orderedAliases } from '@/lib/kb/model/aliases'
import { filterRanks } from '@/lib/kb/model/rank'

import { addedConcepts } from './concept'

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

const closestConcept = (taxonomy, concept) => {
  const parent = getConcept(taxonomy, concept.parent)

  if (parent.children.length === 1) {
    return parent
  }

  const childIndex = parent.children.indexOf(concept.name)
  if (childIndex === 0) {
    return getConcept(taxonomy, parent.children[1])
  }

  return getConcept(taxonomy, parent.children[childIndex - 1])
}

const deleteConcept = async (taxonomy, concept, apiFns) => {
  if (0 < concept.children.length) {
    throw new Error(`Concept "${concept.name}" has children.`)
  }

  await apiFns.apiPayload(apiDeleteConcept, concept.name)

  const conceptMap = { ...taxonomy.conceptMap }
  delete conceptMap[concept.name]

  let aliasMap
  if (0 < concept.alternateNames.length) {
    aliasMap = { ...taxonomy.aliasMap }
    concept.alternateNames.forEach(alternateName => {
      delete aliasMap[alternateName]
    })
  } else {
    aliasMap = taxonomy.aliasMap
  }

  const parent = { ...getConcept(taxonomy, concept.parent) }

  parent.children = parent.children.filter(child => child !== concept.name)
  mapConcept(parent, conceptMap, aliasMap)

  const names = await apiFns.apiPayload(fetchNames)

  const updatedTaxonomy = {
    ...taxonomy,
    aliasMap,
    conceptMap,
    names,
  }

  return { closestConcept: closestConcept(taxonomy, concept), taxonomy: updatedTaxonomy }
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

const isConceptLoaded = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return (
    concept &&
    concept.aliases &&
    concept.children &&
    concept.children.every(child => taxonomy.conceptMap[child]?.children) &&
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

const getAncestors = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  if (!concept) return []

  const ancestors = []
  let currentConcept = concept

  while (currentConcept.parent && !isRoot(taxonomy, currentConcept)) {
    const parent = getConcept(taxonomy, currentConcept.parent)
    if (parent) {
      ancestors.push(parent.name)
      currentConcept = parent
    } else {
      break
    }
  }

  return ancestors
}

const loadTaxonomy = async apiFns => {
  const [root, names, ranks] = await Promise.all([
    apiFns.apiPayload(fetchRoot),
    apiFns.apiPayload(fetchNames),
    apiFns.apiPayload(fetchRanks),
  ])

  const rootConcept = await apiFns.apiPayload(fetchConcept, root.name)
  const rootConceptNames = await apiFns.apiPayload(fetchConceptNames, rootConcept.name)
  rootConcept.aliases = orderedAliases(rootConceptNames)

  const aliasMap = rootConcept.aliases.reduce((acc, alias) => {
    acc[alias.name] = rootConcept
    return acc
  }, {})
  const conceptMap = { [rootConcept.name]: rootConcept }

  const taxonomy = {
    aliasMap,
    conceptMap,
    names,
    ranks,
    rootName: rootConcept.name,
  }

  return { taxonomy }
}

// Taxonomy concepts are look-ahead loaded for tree display.
const loadTaxonomyConcept = async (taxonomy, conceptName, apiFns) => {
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
    : await apiFns.apiPayload(fetchConcept, conceptName)

  if (concept.name !== taxonomy.rootName && !concept.parent) {
    const parent = await apiFns.apiPayload(fetchParent, concept.name)
    concept.parent = parent.name
  }

  if (!concept.aliases) {
    const conceptNames = await apiFns.apiPayload(fetchConceptNames, concept.name)
    concept.aliases = orderedAliases(conceptNames)
  }

  // If the concept already has children, we only need to load the concept's grand children. This
  //  typically happens when a child concept is selected.
  if (concept?.children) {
    await Promise.all(
      concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiFns))
    )
    mapConcept(concept, conceptMap, aliasMap)
    return { concept: concept, taxonomy: updatedTaxonomy }
  }

  // Load the concept's children
  const children = await apiFns.apiPayload(fetchChildren, concept.name)
  concept.children = children.map(child => child.name)
  children.forEach(child => {
    child.parent = concept.name
    mapConcept(child, conceptMap, aliasMap)
  })

  // Load the concept's grandchildren
  await Promise.all(
    concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiFns))
  )

  // If the concept is the root, we're done.
  if (isRoot(taxonomy, concept)) {
    mapConcept(concept, conceptMap, aliasMap)
    return { concept: concept, taxonomy: updatedTaxonomy }
  }

  // We're loading a concept the taxonomy knows nothing about (from either a name search or an
  //  initial loading of saved state). To load and connect the concept into the tree, build a chain
  //  of concept names from the concept to the root. For concepts in the chain but not in the
  //  taxonomy, fetch the parent to get the necessary name. Then walk the chain from the top and
  //  load each concept, children and grandchildren not already loaded.

  let nextAncestor = await apiFns.apiPayload(fetchParent, concept.name)
  concept.parent = nextAncestor.name
  const conceptAncestry = [concept.name]

  while (!updatedTaxonomy.conceptMap[nextAncestor.name]) {
    conceptAncestry.push(nextAncestor.name)
    nextAncestor = await apiFns.apiPayload(fetchParent, nextAncestor.name)
  }
  conceptAncestry.push(nextAncestor.name)

  while (!isRoot(taxonomy, nextAncestor)) {
    const parent = await apiFns.apiPayload(fetchParent, nextAncestor.name)
    nextAncestor = updatedTaxonomy.conceptMap[parent.name]
    conceptAncestry.push(nextAncestor.name)
  }
  conceptAncestry.reverse()

  for (const name of conceptAncestry) {
    const children = await loadTaxonomyConceptChildren(updatedTaxonomy, name, apiFns)
    await Promise.all(
      children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiFns))
    )
  }

  // Wait until here to map the primary loaded concept (by conceptName) since the above processing
  // may have loaded that concept as a child of its parent and we would lose the "extra" data
  // (aliases, etc) that we already loaded for it.
  mapConcept(concept, conceptMap, aliasMap)

  return { concept: concept, taxonomy: updatedTaxonomy }
}

const loadTaxonomyConceptChildren = async (updatableTaxonomy, conceptName, apiFns) => {
  const concept = getConcept(updatableTaxonomy, conceptName)

  const conceptMap = updatableTaxonomy.conceptMap
  const aliasMap = updatableTaxonomy.aliasMap

  if (concept && !concept.children) {
    const updatedConcept = { ...concept }
    const children = await apiFns.apiPayload(fetchChildren, concept.name)
    updatedConcept.children = children.map(child => child.name)
    children.forEach(child => {
      child.parent = concept.name
      mapConcept(child, conceptMap, aliasMap)
    })
    mapConcept(updatedConcept, conceptMap, aliasMap)
    return updatedConcept.children
  }

  return concept.children
}

const loadTaxonomyConceptDescendants = async (taxonomy, concept, apiFns) => {
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
      const children = await apiFns.apiPayload(fetchChildren, descendant.name)
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

const refreshTaxonomyConcept = async (taxonomy, concept, updatesInfo, apiFns) => {
  const { hasUpdated } = updatesInfo

  const conceptMap = { ...taxonomy.conceptMap }
  const aliasMap = { ...taxonomy.aliasMap }

  const updatedConcept = await apiFns.apiPayload(fetchConcept, concept.name)

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
    // Add any newly added children into the maps
    addedConcepts(updatedConcept.name, updatesInfo).forEach(child => {
      mapConcept(child, conceptMap, aliasMap)
    })

    // Remove any children that were removed from this concept
    const priorChildren = Array.isArray(concept.children) ? concept.children : []
    const currentChildren = Array.isArray(updatedConcept.children) ? updatedConcept.children : []
    const removedChildren = priorChildren.filter(name => !currentChildren.includes(name))

    removedChildren.forEach(childName => {
      const childConcept = taxonomy.conceptMap[childName] || conceptMap[childName]
      if (childConcept) {
        // Drop the child concept from conceptMap
        delete conceptMap[childName]
        // Drop all alias names that pointed to that child
        if (Array.isArray(childConcept.alternateNames)) {
          childConcept.alternateNames.forEach(alternateName => {
            if (aliasMap[alternateName]) delete aliasMap[alternateName]
          })
        }
      }
    })
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

  const updatedNames = await apiFns.apiPayload(fetchNames)

  const updatedTaxonomy = {
    ...taxonomy,
    aliasMap,
    conceptMap,
    names: updatedNames,
  }

  return { concept: updatedConcept, taxonomy: updatedTaxonomy }
}

const removeTaxonomyConcept = (taxonomy, concept) => {
  if (concept.children.length > 0) {
    throw new Error(`Concept "${concept.name}" has children.`)
  }

  const conceptMap = { ...taxonomy.conceptMap }
  delete conceptMap[concept.name]

  const aliasMap = { ...taxonomy.aliasMap }
  concept.alternateNames.forEach(alternateName => {
    delete aliasMap[alternateName]
  })

  const parentConcept = { ...conceptMap[concept.parent] }
  parentConcept.children = parentConcept.children.filter(child => child !== concept.name)
  mapConcept(parentConcept, conceptMap, aliasMap)

  const updatedTaxonomy = {
    ...taxonomy,
    conceptMap,
    aliasMap,
  }

  return { taxonomy: updatedTaxonomy }
}

export {
  buildTree,
  closestConcept,
  deleteConcept,
  descendants,
  filterTaxonomyRanks,
  getAncestors,
  getConcept,
  getConceptPrimaryName,
  getNames,
  isConceptLoaded,
  isDescendant,
  isRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  mapConcept,
  refreshTaxonomyConcept,
  removeTaxonomyConcept,
}
