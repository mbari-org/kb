import { fetchHistory } from '@/lib/kb/api/history'
import { fetchNames, fetchRanks, fetchRoot } from '@/lib/kb/api/taxonomy'

import { filterRanks } from '@/lib/kb/conceptState/rank'

import {
  addedConcepts,
  loadChildren,
  loadConcept,
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
  if (0 < concept.aliases.length) {
    aliasMap = { ...taxonomy.aliasMap }
    concept.aliases.forEach(alias => {
      delete aliasMap[alias.name]
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

const isConceptComplete = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return isConceptTreeReady(taxonomy, conceptName) && concept.linkRealizations
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
  const [rootConcept, names, ranks, { approvedHistory, pendingHistory }] = await Promise.all([
    apiPayload(fetchRoot),
    apiPayload(fetchNames),
    apiPayload(fetchRanks),
    loadTaxonomyHistory(apiPayload),
  ])

  const shellTaxonomy = {
    aliasMap: {},
    conceptMap: {},
    rootName: rootConcept.name,
  }

  const { taxonomy: loadedMapsTaxonomy } = await loadTaxonomyConcept(
    shellTaxonomy,
    rootConcept.name,
    apiPayload
  )

  const taxonomy = {
    aliasMap: loadedMapsTaxonomy.aliasMap,
    approvedHistory,
    conceptMap: loadedMapsTaxonomy.conceptMap,
    names,
    pendingHistory,
    ranks,
    rootName: rootConcept.name,
  }

  return { taxonomy }
}

// Taxonomy concepts are always look-ahead loaded for tree display. Loaded concepts may not be
//  "complete" until displayed in the Concept panel, at which time the necessary calls are made
//  to complete the concept.
const loadTaxonomyConcept = async (taxonomy, conceptName, apiPayload) => {
  const taxonomyConcept = getConcept(taxonomy, conceptName)

  // If the concept is ready for display, there is nothing to do.
  if (isConceptComplete(taxonomy, taxonomyConcept)) {
    return { taxonomy, wasComplete: true }
  }

  const updatedTaxonomy = {
    ...taxonomy,
    conceptMap: { ...taxonomy.conceptMap },
    aliasMap: { ...taxonomy.aliasMap },
  }

  // If the concept already has children, we only load the concept's grand children. This is
  //  typical when an expanded tree concept child is selected.
  if (taxonomyConcept?.children) {
    await Promise.all(
      taxonomyConcept.children.map(child =>
        loadTaxonomyConceptChildren(updatedTaxonomy, child, apiPayload)
      )
    )
    return { taxonomy: updatedTaxonomy, wasComplete: false }
  }

  // If the concept is in the taxonomy (but not ready for display), first we make it ready to
  //  display in the tree by loading the children of the concept's parent to load the concept and
  //  its siblings, and then we load the grand children of the concept. Then we make it complete
  //  by loading the linkRealizations.
  if (taxonomyConcept) {
    const parentConcept = updatedTaxonomy.conceptMap[taxonomyConcept.parent]
    await Promise.all(
      parentConcept.children.map(child =>
        loadTaxonomyConceptChildren(updatedTaxonomy, child, apiPayload)
      )
    )

    const concept = getConcept(updatedTaxonomy, taxonomyConcept.name)
    await Promise.all(
      concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiPayload))
    )

    return { taxonomy: updatedTaxonomy, wasComplete: false }
  }

  // If the concept is not in the taxonomy, make it complete
  const concept = await loadConcept(conceptName, apiPayload)
  mapConcept(updatedTaxonomy, concept)

  // Load the concept's children
  const children = await loadChildren(concept.name, apiPayload)
  concept.children = children.map(child => child.name)
  children.forEach(child => {
    mapConcept(updatedTaxonomy, child)
  })

  // If the concept is the root, we're loading the initial shell taxonomy.
  if (isRoot(taxonomy, concept)) {
    return { taxonomy: updatedTaxonomy, wasComplete: false }
  }

  // We're loading a concept the taxonomy knows nothing about (from either a name search or an
  //  initial loading of saved state). To load and connect the concept into the tree, build a chain
  //  of concept names from the concept to the root. For concepts not in the taxonomy, fetch the
  //  parent to get the necessary name. Then walk the chain from the top and load the
  //  concepts, children and grandchildren not already in taxonomy.

  let nextAncestor = await loadParent(concept.name, apiPayload)
  concept.parent = nextAncestor.name
  const conceptAncestry = [concept.name]

  while (!updatedTaxonomy.conceptMap[nextAncestor.name]) {
    conceptAncestry.push(nextAncestor.name)
    nextAncestor = await loadParent(nextAncestor.name, apiPayload)
  }
  conceptAncestry.push(nextAncestor.name)

  const parent = await loadParent(nextAncestor.name, apiPayload)
  nextAncestor = updatedTaxonomy.conceptMap[parent.name]

  while (!isRoot(taxonomy, nextAncestor)) {
    conceptAncestry.push(nextAncestor.name)
    nextAncestor = updatedTaxonomy.conceptMap[nextAncestor.parent]
    conceptAncestry.push(nextAncestor.name)
  }

  conceptAncestry.reverse()

  for (const name of conceptAncestry) {
    const children = await loadTaxonomyConceptChildren(updatedTaxonomy, name, apiPayload)
    await Promise.all(
      children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiPayload))
    )
  }

  return { taxonomy: updatedTaxonomy, wasComplete: false }
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

const loadTaxonomyConceptDescendants = async (concept, apiPayload) => {
  const children = await loadChildren(concept, apiPayload)
  concept.children = children

  // for (const child of children) {
  //   await loadConceptDescendants(child, apiPayload)
  // }
  // const updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }
  // const updatableConcept = { ...concept }
  // await loadConceptChildren(apiPayload, updatableTaxonomy, updatableConcept)
  // if (updatableConcept.children) {
  //   for (const child of updatableConcept.children) {
  //     await loadConceptDescendants(apiPayload, updatableTaxonomy, child, true)
  //   }
  // }
  // return { taxonomy: updatableTaxonomy }
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
  concept.aliases.forEach(alias => {
    taxonomy.aliasMap[alias.name] = concept
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
    concept.aliases.forEach(alias => {
      aliasMap[alias.name] = concept
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

    concept.aliases.forEach(alias => {
      if (!aliasMap[alias.name]) {
        conceptError(concept, `has alias "${alias.name}" that is not in aliasMap`)
      }
      if (concept !== aliasMap[alias.name]) {
        conceptError(concept, `aliasMap "${alias.name}" is not the concept`)
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
  isConceptComplete,
  isConceptTreeReady,
  isRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  mapsFromConcept,
  refreshTaxonomyConcept,
  refreshTaxonomyHistory,
}
