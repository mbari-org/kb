import { fetchHistory } from '@/lib/services/oni/api/history'
import { fetchNames, fetchRanks, fetchRoot } from '@/lib/services/oni/api/taxonomy'

import { filterRanks } from './concept/rank'

import { loadChildren, loadConcept, loadParent, refresh as refreshConcept } from './concept'

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

  // CxTBD when loading 'jpg', 'image' does not have children.

  return taxonomyTree
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

  return { taxonomy: updatedTaxonomy }
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
  return (
    concept &&
    concept.children &&
    concept.children.every(child => taxonomy.conceptMap[child].children) &&
    (concept.name === taxonomy.rootName || concept.parent)
  )
}

const isLoadedGrandChild = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return concept && concept.parent && !concept.children
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
  if (isConceptComplete(taxonomy, taxonomyConcept)) {
    return { taxonomy, wasComplete: true }
  }

  const updatedTaxonomy = {
    ...taxonomy,
    conceptMap: { ...taxonomy.conceptMap },
    aliasMap: { ...taxonomy.aliasMap },
  }

  // Due to preloading of grand children, this common case warrants specific handling.
  if (isLoadedGrandChild(taxonomy, conceptName)) {
    const parentChildren = getConcept(taxonomy, taxonomyConcept.parent).children
    const grandChildren = await Promise.all(
      parentChildren.map(child => loadChildren(child, apiPayload))
    )
    parentChildren.forEach((childName, index) => {
      const child = updatedTaxonomy.conceptMap[childName]
      child.children = grandChildren[index].map(grandChild => grandChild.name)
      grandChildren[index].forEach(grandChild => {
        mapConcept(updatedTaxonomy, grandChild)
      })
    })

    return { taxonomy: updatedTaxonomy, wasComplete: false }
  } else {
    let concept
    if (!taxonomyConcept) {
      concept = await loadConcept(conceptName, apiPayload)
      const children = await loadChildren(concept.name, apiPayload)

      // We load the parent just to get the name, which is not in a loaded concept.
      const apiParent = !isRoot(taxonomy, concept)
        ? await loadParent(concept.name, apiPayload)
        : null
      concept.parent = apiParent?.name

      concept.children = children.map(child => child.name)
      children.forEach(child => {
        mapConcept(updatedTaxonomy, child)
      })

      if (concept.parent) {
        let parentName = concept.parent

        // Keep loading parents if not in the taxonomy.
        while (!updatedTaxonomy.conceptMap[parentName]) {
          // Load this parent's info and children
          const parentConcept = await loadConcept(parentName, apiPayload)
          const parentChildren = await loadChildren(parentConcept.name, apiPayload)
          parentConcept.children = parentChildren.map(child => child.name)
          parentChildren.forEach(child => {
            mapConcept(updatedTaxonomy, child)
          })

          // Get the next parent
          const nextParent = await loadParent(parentConcept.name, apiPayload)
          if (nextParent) {
            parentConcept.parent = nextParent.name
          }

          // Map parent
          mapConcept(updatedTaxonomy, parentConcept)

          parentName = nextParent?.name
        }

        // If previously loaded as a grandchild, a concept's children have not been loaded.
        if (updatedTaxonomy.conceptMap[parentName]?.children ?? true) {
          const parent = { ...updatedTaxonomy.conceptMap[parentName] }
          const children = await loadChildren(parentName, apiPayload)
          parent.children = children.map(child => child.name)
          children.forEach(child => {
            // Don't map the child we just loaded above.
            if (!updatedTaxonomy.conceptMap[child.name]) {
              child.parent = parentName
              mapConcept(updatedTaxonomy, child)
            }
          })
          // Map the cloned parent that has children set
          mapConcept(updatedTaxonomy, parent)
        }
      }
      // map the concept to the taxonomy
      mapConcept(updatedTaxonomy, concept)
    } else if (taxonomyConcept.children) {
      concept = taxonomyConcept
    } else {
      concept = { ...taxonomyConcept }
      const children = await loadChildren(concept.name, apiPayload)
      children.forEach(child => {
        if (!updatedTaxonomy.conceptMap[child.name]) {
          child.parent = concept.name
          mapConcept(updatedTaxonomy, child)
        }
      })
      concept.children = children.map(child => child.name)
    }

    // grand children are always loaded so the taxonomy tree display knows if a concept's children
    //  have children, in which case the expanded icon will appear for that child
    const grandChildren = await Promise.all(
      concept.children.map(child => loadChildren(child, apiPayload))
    )
    concept.children.forEach((childName, index) => {
      const child = updatedTaxonomy.conceptMap[childName]
      child.children = grandChildren[index].map(grandChild => grandChild.name)
      grandChildren[index].forEach(grandChild => {
        mapConcept(updatedTaxonomy, grandChild)
      })
    })
  }

  return { taxonomy: updatedTaxonomy, wasComplete: false }
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
  isRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  mapsFromConcept,
  refreshTaxonomyConcept,
  refreshTaxonomyHistory,
}
