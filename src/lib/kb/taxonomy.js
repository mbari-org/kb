import { fetchHistory } from '@/lib/services/oni/api/history'
import { fetchNames, fetchRanks, fetchRoot } from '@/lib/services/oni/api/taxonomy'

import { filterRanks } from './concept/rank'

import {
  addChild as addChildConcept,
  loadChildren,
  load as loadConcept,
  loadParent,
  refresh as refreshConcept,
} from './concept'

const addChild = (updatableConcepts, updatableRoot, updatableChild) => {
  const updatableParent = { ...updatableChild.parent }
  addChildConcept(updatableParent, updatableChild)

  const conceptParentInRoot = findConcept(updatableRoot, updatableParent.name)
  conceptParentInRoot.children = updatableParent.children

  updatableConcepts[updatableChild.name] = updatableChild
  updatableRoot[updatableParent.name] = updatableParent
}

const deleteConcept = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  if (!concept) {
    throw new Error(`Concept "${conceptName}" not found in the taxonomy.`)
  }
  if (0 < concept.children.length) {
    throw new Error(`Concept "${conceptName}" has children.`)
  }

  const updatedConceptMap = rewireConceptAncestry(taxonomy.conceptMap, concept)
  const updatedParent = updatedConceptMap[concept.parent.name]
  updatedParent.children = updatedParent.children.filter(child => child.name !== concept.name)

  const deletedNames = [concept.name, ...concept.alternateNames]
  const updatedNames = taxonomy.names.filter(name => !deletedNames.includes(name))

  const aliasMap = mapsFromConcept(updatedConceptMap, true).aliasMap

  const updatedTaxonomy = {
    ...taxonomy,
    aliasMap,
    conceptMap: updatedConceptMap,
    names: updatedNames,
  }

  cxDebugTaxonomyIntegrity(updatedTaxonomy)

  return { taxonomy: updatedTaxonomy }
}

const filterTaxonomyRanks = (taxonomy, field, otherValue) =>
  filterRanks(taxonomy.ranks, field, otherValue)

const findConcept = (root, conceptName) => {
  const search = (node, name) => {
    if (node.name === name) {
      return node
    }

    if (node.children) {
      for (const child of node.children) {
        const found = search(child, name)
        if (found) {
          return found
        }
      }
    }

    return null
  }

  return search(root, conceptName)
}

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

const getRoot = taxonomy => taxonomy?.conceptMap[taxonomy?.rootName]

const isConceptComplete = concept =>
  concept && concept.children && concept.children.every(child => child.children)

const isRoot = (taxonomy, concept) => concept.name === taxonomy.rootName

const loadTaxonomy = async apiPayload => {
  const [rootConcept, names, ranks, { approvedHistory, pendingHistory }] = await Promise.all([
    apiPayload(fetchRoot),
    apiPayload(fetchNames),
    apiPayload(fetchRanks),
    loadTaxonomyHistory(apiPayload),
  ])

  const { concept: root } = await loadTaxonomyConcept(null, rootConcept.name, apiPayload)
  const { aliasMap, conceptMap } = mapsFromConcept(root)

  const taxonomy = {
    aliasMap,
    approvedHistory,
    conceptMap,
    names,
    pendingHistory,
    ranks,
    rootName: rootConcept.name,
  }

  // const initialSelected = selectedStore.get()
  // if (!initialSelected) {
  //   return { taxonomy }
  // }

  // const conceptName = initialSelected.concept
  // if (conceptName === taxonomy.rootName) {
  //   return { taxonomy }
  // }

  // if (!names.includes(conceptName)) {
  //   selectedStore.set({ ...initialSelected, concept: taxonomy.rootName })
  //   return { taxonomy }
  // }

  cxDebugTaxonomyIntegrity(taxonomy)

  return { taxonomy }
}

// Taxonomy concepts are always look-ahead loaded for tree display. Loaded concepts may not be
//  "complete" until displayed in the Concept panel, at which time the necessary calls are made
//  to complete the concept.
const loadTaxonomyConcept = async (taxonomy, conceptName, apiPayload) => {
  const taxonomyConcept = getConcept(taxonomy, conceptName)
  if (isConceptComplete(taxonomyConcept)) {
    return { concept: taxonomyConcept, wasComplete: true }
  }

  // If the concept is in the taxonomy, clone; o/w load
  const concept = taxonomyConcept
    ? { ...taxonomyConcept }
    : await loadConcept(conceptName, apiPayload)

  // If the taxonomy concept has children, clone; o/w load
  concept.children = taxonomyConcept?.children
    ? taxonomyConcept.children.map(child => ({ ...child }))
    : await loadChildren(concept, apiPayload)

  // grand children must always be loaded
  const grandChildren = await Promise.all(
    concept.children.map(child => loadChildren(child, apiPayload))
  )
  concept.children.forEach((child, index) => {
    child.children = grandChildren[index]
  })

  // If there is no taxonomy yet, we are loading the root concept so we're done
  if (!taxonomy) {
    return { concept, wasComplete: false }
  }

  // If the concept has no parent, load ancestors until we hit an existing taxonomy concept
  let taxonomyAncestor = concept.parent
  if (!taxonomyAncestor) {
    taxonomyAncestor = await loadParent(concept, apiPayload)
    while (!taxonomyAncestor.parent) {
      taxonomyAncestor = await loadParent(ancestor, apiPayload)
    }
  }

  // If the concept has a parent, we've cloned it from the taxonomy, so we need to updated its
  //  ancestors before returning
  if (concept.parent) {
    const updatedParent = { ...concept.parent }
    updatedParent.children = [...concept.parent.children]
    const conceptIndex = updatedParent.children.findIndex(child => child.name === concept.name)
    if (conceptIndex !== -1) {
      updatedParent.children[conceptIndex] = concept
    }
    concept.parent = updatedParent

    return { concept, wasComplete: false }
  }

  let ancestor = await loadParent(concept, apiPayload)
  while (!ancestor.parent) {
    ancestor = await loadParent(ancestor, apiPayload)
  }

  return { concept, wasComplete: false }

  // Now we need to fit these updates into the taxonomy.
  // const updatedConceptMap = rewireConceptAncestry(taxonomy.conceptMap, concept)
  // const aliasMap = mapsFromConcept(updatedConceptMap, true).aliasMap

  // const updatedTaxonomy = {
  //   ...taxonomy,
  //   aliasMap,
  //   conceptMap: updatedConceptMap,
  // }
  // return { taxonomy: updatedTaxonomy, wasComplete: false }
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

const refreshTaxonomyConcept = async (taxonomy, concept, updateInfo, apiPayload) => {
  const { hasUpdated } = updateInfo

  const updatableTaxonomy = {
    aliasMap: { ...taxonomy.aliasMap },
    // concepts: Object.fromEntries(
    //   Object.entries(taxonomy.concepts).filter(([name]) => name !== concept.name)
    // ),
    ranks: [...taxonomy.ranks],
  }

  const updatableConcept = await refreshConcept(concept, updateInfo, apiPayload)

  await refreshTaxonomyHistory(apiPayload, updatableTaxonomy)

  if (hasUpdated('children')) {
    console.log('add children')
  }

  if (hasUpdated('aliases') || hasUpdated('name')) {
    updatableTaxonomy.names = await apiPayload(fetchNames)
  } else {
    updatableTaxonomy.names = [...taxonomy.names]
  }

  updatableTaxonomy.concepts[updatableConcept.name] = updatableConcept
  updatableTaxonomy.root = rootWithConcept(taxonomy, updatableConcept)

  return { concept: updatableConcept, taxonomy: updatableTaxonomy }
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

// Builds maps from a concept through its descendants
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

const refreshTaxonomyHistory = async (apiPayload, updatableTaxonomy) => {
  const [approvedHistory, pendingHistory] = await Promise.all([
    apiPayload(fetchHistory, 'approved'),
    apiPayload(fetchHistory, 'pending'),
  ])
  updatableTaxonomy.approvedHistory = approvedHistory
  updatableTaxonomy.pendingHistory = pendingHistory
}

const rewireConceptAncestry = (conceptMap, concept) => {
  const updatedConceptMap = { ...conceptMap }
  let currentParent = concept.parent
  while (currentParent) {
    const updatedParent = { ...currentParent }
    if (currentParent.parent) {
      const parentInTree = { ...currentParent.parent }
      const childIndex = parentInTree.children.findIndex(child => child.name === currentParent.name)
      parentInTree.children = [...parentInTree.children]
      parentInTree.children[childIndex] = updatedParent
      updatedConceptMap[parentInTree.name] = parentInTree
    }
    updatedConceptMap[currentParent.name] = updatedParent
    currentParent = currentParent.parent
  }
  return updatedConceptMap
}

const rootWithConcept = (taxonomy, concept) => updatedRootWithConcept(taxonomy.root, concept, true)

const updatedRootWithConcept = (node, concept, add) => {
  if (node.name === concept.name) {
    return add ? { ...concept } : null
  }
  return {
    ...node,
    children: node.children
      ? node.children
          .map(child => updatedRootWithConcept(child, concept, add))
          .filter(child => child !== null)
      : [],
  }
}

export const cxDebugTaxonomyIntegrity = taxonomy => {
  const conceptMap = taxonomy.conceptMap
  const aliasMap = taxonomy.aliasMap
  const root = conceptMap[taxonomy.rootName]

  const validateConcept = concept => {
    const conceptError = (concept, reason) => {
      throw new Error(`Concept "${concept.name}" ${reason}`)
    }

    if (!conceptMap[concept.name]) {
      conceptError(concept, 'is not in the concept map')
    }

    if (concept !== conceptMap[concept.name]) {
      conceptError(concept, `conceptMap "${concept.name}" is not the concept`)
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
      if (child.parent !== concept) {
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

  validateConceptTree(root)
  console.log('cxDebugTaxonomyIntegrity passed')
}

export {
  deleteConcept,
  filterTaxonomyRanks,
  getConcept,
  getConceptPendingHistory,
  getConceptPrimaryName,
  getNames,
  getRoot,
  isRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  mapsFromConcept,
  refreshTaxonomyConcept,
  refreshTaxonomyHistory,
}
