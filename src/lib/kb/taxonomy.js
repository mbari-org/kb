import { fetchHistory } from '@/lib/services/oni/api/history'
import { fetchNames, fetchRanks, fetchRoot } from '@/lib/services/oni/api/taxonomy'

import { filterRanks } from './concept/rank'

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
  return (
    concept &&
    concept.children &&
    concept.children.every(child => taxonomy.conceptMap[child].children) &&
    (concept.name === taxonomy.rootName || concept.parent)
  )
}

// Was the concept loaded as a grandchild (and hence its children are unknown)?
const wasLoadedAsGrandChild = (taxonomy, conceptName) => {
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

  // Due to preloading grand children (w/o children), this common case warrants specific handling.
  if (wasLoadedAsGrandChild(taxonomy, conceptName)) {
    // Load sibling children
    const siblings = getConcept(taxonomy, taxonomyConcept.parent).children
    const siblingChildren = await Promise.all(
      siblings.map(sibling => loadChildren(sibling, apiPayload))
    )
    siblings.forEach((siblingName, index) => {
      const sibling = updatedTaxonomy.conceptMap[siblingName]
      sibling.children = siblingChildren[index].map(child => child.name)
      siblingChildren[index].forEach(child => {
        mapConcept(updatedTaxonomy, child)
      })
    })

    // Load concept grandChildren
    const concept = updatedTaxonomy.conceptMap[conceptName]
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

    return { taxonomy: updatedTaxonomy, wasComplete: false }
  } else {
    let concept
    if (!taxonomyConcept) {
      // Load/map the concept
      concept = await loadConcept(conceptName, apiPayload)
      mapConcept(updatedTaxonomy, concept)

      // Load/map the concept's children
      const children = await loadChildren(concept.name, apiPayload)
      concept.children = children.map(child => child.name)
      children.forEach(child => {
        mapConcept(updatedTaxonomy, child)
      })

      // Load/map the concept's grand children
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

      // We need to find an existing ancestor in the taxonomy to connect the concept into the tree.
      //  For each ancestor, look if the ancestor is in the taxonomy. If not, load the ancestor and
      //  look at the next ancestor.

      if (!isRoot(taxonomy, concept)) {
        // To start, load the parent to get its name, which is not part of the API concept response.
        const apiParent = await loadParent(concept.name, apiPayload)
        let ancestor = apiParent.name
        concept.parent = ancestor

        // Since

        // Keep loading ancestors if not in the taxonomy.
        while (!updatedTaxonomy.conceptMap[ancestor]) {
          // Load/map ancestor and its children
          const ancestorConcept = await loadConcept(ancestor, apiPayload)
          const ancestorChildren = await loadChildren(ancestorConcept.name, apiPayload)
          ancestorConcept.children = ancestorChildren.map(child => child.name)
          ancestorChildren.forEach(child => {
            mapConcept(updatedTaxonomy, child)
          })
          mapConcept(updatedTaxonomy, ancestorConcept)

          // Get the next ancestor
          const nextAncestor = await loadParent(ancestorConcept.name, apiPayload)
          if (nextAncestor) {
            ancestorConcept.parent = nextAncestor.name
          }

          ancestor = nextAncestor?.name
        }

        // The ancestor we finally connected to the taxonomy will not have loaded children
        const ancestorConcept = updatedTaxonomy.conceptMap[ancestor]
        const children = await loadChildren(ancestorConcept.name, apiPayload)
        ancestorConcept.children = children.map(child => child.name)
        children.forEach(child => {
          // Don't map the child we loaded above in order to get here.
          if (!updatedTaxonomy.conceptMap[child.name]) {
            child.parent = ancestor
            mapConcept(updatedTaxonomy, child)
          }
        })
        // Re-map the ancestor that we connected to the taxonomy.
        mapConcept(updatedTaxonomy, ancestorConcept)

        // Now we need to load the sibling children of the initial concept being loaded
        //  since the tree display needs that information.
        const conceptParent = updatedTaxonomy.conceptMap[concept.parent]
        const parentGrandChildren = await Promise.all(
          conceptParent.children.map(child => loadChildren(child, apiPayload))
        )
        conceptParent.children.forEach((childName, index) => {
          if (childName !== concept.name) {
            const child = updatedTaxonomy.conceptMap[childName]
            child.children = parentGrandChildren[index].map(grandChild => grandChild.name)
            parentGrandChildren[index].forEach(grandChild => {
              mapConcept(updatedTaxonomy, grandChild)
            })
          }
        })
      }
    } else if (taxonomyConcept.children) {
      concept = taxonomyConcept
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
    // const grandChildren = await Promise.all(
    //   concept.children.map(child => loadChildren(child, apiPayload))
    // )
    // concept.children.forEach((childName, index) => {
    //   const child = updatedTaxonomy.conceptMap[childName]
    //   child.children = grandChildren[index].map(grandChild => grandChild.name)
    //   grandChildren[index].forEach(grandChild => {
    //     mapConcept(updatedTaxonomy, grandChild)
    //   })
    // })
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

const refreshTaxonomyConcept = async (taxonomy, concept, updateInfo, apiPayload) => {
  const { hasUpdated } = updateInfo

  const updatedConcept = await refreshConcept(concept, updateInfo, apiPayload)
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
  isRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  mapsFromConcept,
  refreshTaxonomyConcept,
  refreshTaxonomyHistory,
}
