import { putConceptAnnotation as apiPutConceptAnnotation } from '@/lib/api/annotations'

import {
  getConceptChildren as apiChildren,
  getConcept as apiConcept,
  getConceptAnnotations as apiConceptAnnotations,
  getConceptNames as apiConceptNames,
  deleteConcept as apiDelete,
  getConceptParent as apiParent,
} from '@/lib/api/concept'

import { getNames as apiNames, getRanks as apiRanks, getRoot as apiRoot } from '@/lib/api/taxonomy'

import { createError } from '@/lib/errors'
import { orderedAliases } from '@/lib/kb/model/aliases'
import { filterRanks } from '@/lib/kb/model/rank'
import { sortRealizations } from '@/lib/kb/model/realization'

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

const deleteConcept = async (taxonomy, concept, reassignTo, apiFns) => {
  if (0 < concept.children.length) {
    throw createError(
      'Delete Validation Error',
      `Cannot delete concept "${concept.name}" because it has children.`,
      { childCount: concept.children.length, conceptName: concept.name }
    )
  }

  const conceptAnnotations = await apiFns.apiPayload(apiConceptAnnotations, concept.name)

  const annotationUpdateResults = await Promise.all(
    conceptAnnotations.map(annotation =>
      apiFns.apiRaw(apiPutConceptAnnotation, { ...annotation, concept: reassignTo })
    )
  )

  const errorResult = annotationUpdateResults.find(result => result.error)
  if (errorResult) {
    throw createError(
      'Annotation Update Error',
      'Failed to update concept annotations during delete',
      { failedAnnotation: errorResult.error?.details, conceptName: concept.name, reassignTo },
      errorResult.error?.original
    )
  }

  await apiFns.apiPayload(apiDelete, concept.name)

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
  insertConcept(parent, conceptMap, aliasMap)

  const names = await apiFns.apiPayload(apiNames)

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

const getAncestorNames = (taxonomy, conceptName) => {
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
    apiFns.apiPayload(apiRoot),
    apiFns.apiPayload(apiNames),
    apiFns.apiPayload(apiRanks),
  ])

  const rootConcept = await apiFns.apiPayload(apiConcept, root.name)
  const rootConceptNames = await apiFns.apiPayload(apiConceptNames, rootConcept.name)
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
    : await apiFns.apiPayload(apiConcept, conceptName)

  if (concept.name !== taxonomy.rootName && !concept.parent) {
    const parent = await apiFns.apiPayload(apiParent, concept.name)
    concept.parent = parent.name
  }

  if (!concept.aliases) {
    const conceptNames = await apiFns.apiPayload(apiConceptNames, concept.name)
    concept.aliases = orderedAliases(conceptNames)
  }

  // If the concept already has children, we only need to load the concept's grand children. This
  //  typically happens when a child concept is selected.
  if (concept?.children) {
    await Promise.all(
      concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiFns))
    )
    insertConcept(concept, conceptMap, aliasMap)
    return { concept: concept, taxonomy: updatedTaxonomy }
  }

  const children = await apiFns.apiPayload(apiChildren, concept.name)
  concept.children = children.map(child => child.name)
  children.forEach(child => {
    child.parent = concept.name
    insertConcept(child, conceptMap, aliasMap)
  })

  await Promise.all(
    concept.children.map(child => loadTaxonomyConceptChildren(updatedTaxonomy, child, apiFns))
  )

  if (isRoot(taxonomy, concept)) {
    insertConcept(concept, conceptMap, aliasMap)
    return { concept: concept, taxonomy: updatedTaxonomy }
  }

  // We're loading a concept the taxonomy knows nothing about (from either a name search or an
  //  initial loading of saved state). To load and connect the concept into the tree, build a chain
  //  of concept names from the concept to the root. For concepts in the chain but not in the
  //  taxonomy, fetch the parent to get the necessary name. Then walk the chain from the top and
  //  load each concept, children and grandchildren not already loaded.

  let nextAncestor = await apiFns.apiPayload(apiParent, concept.name)
  concept.parent = nextAncestor.name
  const conceptAncestry = [concept.name]

  while (!updatedTaxonomy.conceptMap[nextAncestor.name]) {
    conceptAncestry.push(nextAncestor.name)
    nextAncestor = await apiFns.apiPayload(apiParent, nextAncestor.name)
  }
  conceptAncestry.push(nextAncestor.name)

  while (!isRoot(taxonomy, nextAncestor)) {
    const parent = await apiFns.apiPayload(apiParent, nextAncestor.name)
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
  insertConcept(concept, conceptMap, aliasMap)

  return { concept: concept, taxonomy: updatedTaxonomy }
}

const loadTaxonomyConceptChildren = async (updatableTaxonomy, conceptName, apiFns) => {
  const concept = getConcept(updatableTaxonomy, conceptName)

  // if (!concept) return []

  const conceptMap = updatableTaxonomy.conceptMap
  const aliasMap = updatableTaxonomy.aliasMap

  if (concept && !concept.children) {
    const updatedConcept = { ...concept }
    const children = await apiFns.apiPayload(apiChildren, concept.name)
    updatedConcept.children = children.map(child => child.name)
    children.forEach(child => {
      child.parent = concept.name
      insertConcept(child, conceptMap, aliasMap)
    })
    insertConcept(updatedConcept, conceptMap, aliasMap)
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
  const toVisit = [...concept.children]
  const descendantNames = []

  const conceptMap = updatedTaxonomy.conceptMap
  const aliasMap = updatedTaxonomy.aliasMap

  while (0 < toVisit.length) {
    const descendantName = toVisit.shift()
    descendantNames.push(descendantName)
    const descendant = getConcept(updatedTaxonomy, descendantName)

    if (!descendant) {
      throw createError(
        'Missing Concept',
        `Concept not found in taxonomy: ${descendantName}`,
        { conceptName: descendantName }
      )
    }

    if (descendant && !descendant.children) {
      const children = await apiFns.apiPayload(apiChildren, descendant.name)
      const updatedDescendant = {
        ...descendant,
        children: children.map(child => child.name),
      }

      insertConcept(updatedDescendant, conceptMap, aliasMap)

      children.forEach(child => {
        toVisit.push(child.name)
        const updatedChild = {
          ...child,
          parent: descendantName,
        }
        insertConcept(updatedChild, conceptMap, aliasMap)
      })
    } else if (descendant?.children) {
      toVisit.push(...descendant.children)
    }
  }

  return { descendantNames, taxonomy: updatedTaxonomy }
}

const insertConcept = (concept, conceptMap, aliasMap) => {
  conceptMap[concept.name] = concept
  concept.alternateNames.forEach(alternateName => {
    aliasMap[alternateName] = concept
  })
  if (concept.linkRealizations) {
    concept.realizations = sortRealizations(concept.linkRealizations)
    delete concept.linkRealizations
  }
}

const refreshTaxonomyConcept = async (taxonomy, concept, updatesInfo, apiFns) => {
  const { hasUpdated } = updatesInfo

  const conceptMap = { ...taxonomy.conceptMap }
  const aliasMap = { ...taxonomy.aliasMap }

  const updatedConcept = await apiFns.apiPayload(apiConcept, concept.name)

  insertConcept(updatedConcept, conceptMap, aliasMap)

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
    addedConcepts(updatedConcept.name, updatesInfo).forEach(child => {
      insertConcept(child, conceptMap, aliasMap)
    })

    const priorChildren = concept.children
    const currentChildren = updatedConcept.children
    const removedChildren = priorChildren.filter(name => !currentChildren.includes(name))

    removedChildren.forEach(childName => {
      const childConcept = taxonomy.conceptMap[childName] || conceptMap[childName]
      if (childConcept) {
        // Drop the child concept from conceptMap
        delete conceptMap[childName]
        // Drop all alias names that pointed to that child
        childConcept.alternateNames.forEach(alternateName => {
          if (aliasMap[alternateName]) delete aliasMap[alternateName]
        })
      }
    })
  }

  if (hasUpdated('parent')) {
    const priorParentConcept = { ...taxonomy.conceptMap[concept.parent] }
    priorParentConcept.children = priorParentConcept.children.filter(
      child => child !== updatedConcept.name
    )
    insertConcept(priorParentConcept, conceptMap, aliasMap)

    const parentConcept = { ...conceptMap[updatedConcept.parent] }
    parentConcept.children = [...parentConcept.children, updatedConcept.name].sort()
    insertConcept(parentConcept, conceptMap, aliasMap)
  }

  const updatedNames = await apiFns.apiPayload(apiNames)

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
    throw createError(
      'Delete Validation Error',
      `Cannot delete concept "${concept.name}" because it has children`,
      { conceptName: concept.name, childCount: concept.children.length }
    )
  }

  const conceptMap = { ...taxonomy.conceptMap }
  delete conceptMap[concept.name]

  const aliasMap = { ...taxonomy.aliasMap }
  concept.alternateNames.forEach(alternateName => {
    delete aliasMap[alternateName]
  })

  const parentConcept = { ...conceptMap[concept.parent] }
  parentConcept.children = parentConcept.children.filter(child => child !== concept.name)
  insertConcept(parentConcept, conceptMap, aliasMap)

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
  getAncestorNames,
  getConcept,
  getConceptPrimaryName,
  getNames,
  insertConcept,
  isConceptLoaded,
  isDescendant,
  isRoot,
  loadTaxonomy,
  loadTaxonomyConcept,
  loadTaxonomyConceptDescendants,
  refreshTaxonomyConcept,
  removeTaxonomyConcept,
}
