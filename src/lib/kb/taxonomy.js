import {
  fetchConcept,
  fetchChildren as fetchConceptChildren,
  fetchNames as fetchConceptNames,
  fetchParent as fetchConceptParent,
} from '@/lib/services/oni/api/concept'

import { fetchHistory } from '@/lib/services/oni/api/history'
import { fetchNames, fetchRanks, fetchRoot } from '@/lib/services/oni/api/taxonomy'

import selectedStore from '@/lib/store/selected'

import { refresh as conceptRefresh, incompleteTaxonomy } from './concept'
import { orderedAliases } from './concept/aliases'
import { filterRanks } from './concept/rank'

import { addChild as addChildConcept } from './concept'

const addChild = (updatableConcepts, updatableRoot, updatableChild) => {
  const updatableParent = { ...updatableChild.parent }
  addChildConcept(updatableParent, updatableChild)

  const conceptParentInRoot = findRootConcept(updatableRoot, updatableParent.name)
  conceptParentInRoot.children = updatableParent.children

  updatableConcepts[updatableChild.name] = updatableChild
  updatableRoot[updatableParent.name] = updatableParent
}

const addConceptAndAlternateNames = async (updatableTaxonomy, concept) => {
  updatableTaxonomy.concepts[concept.name] = concept

  if (0 < concept.alternateNames?.length) {
    const aliasMap = { ...updatableTaxonomy.aliasMap }
    concept.alternateNames.forEach(name => {
      aliasMap[name] = concept.name
    })
    updatableTaxonomy.aliasMap = aliasMap
  }
}

const deleteConcept = (taxonomy, conceptName) => {
  const { [conceptName]: deletedConcept, ...updatedConcepts } = taxonomy.concepts

  const conceptParent = { ...deletedConcept.parent }
  conceptParent.children = conceptParent.children.filter(child => child.name !== conceptName)
  updatedConcepts[conceptParent.name] = conceptParent

  const updatedAliasMap = { ...taxonomy.aliasMap }
  deletedConcept.alternateNames.forEach(name => delete updatedAliasMap[name])

  const deletedNames = [deletedConcept.name, ...deletedConcept.alternateNames]
  const updatedNames = taxonomy.names.filter(name => !deletedNames.includes(name))

  const updatedRoot = { ...taxonomy.root }
  const conceptParentInRoot = findRootConcept(taxonomy.root, conceptParent.name)
  conceptParentInRoot.children = conceptParent.children

  const updatedTaxonomy = {
    aliasMap: updatedAliasMap,
    approvedHistory: [...taxonomy.approvedHistory],
    concepts: updatedConcepts,
    names: updatedNames,
    pendingHistory: [...taxonomy.pendingHistory],
    ranks: [...taxonomy.ranks],
    root: updatedRoot,
  }

  return { taxonomy: updatedTaxonomy }
}

const getConcept = (taxonomy, conceptName) => {
  let concept = taxonomy?.concepts[conceptName]
  if (concept) {
    return concept
  }

  const aliasedName = taxonomy.aliasMap[conceptName]
  if (aliasedName) {
    return taxonomy.concepts[aliasedName] || null
  }

  return null
}

const getNames = taxonomy => taxonomy?.names

const getConceptPendingHistory = (taxonomy, conceptName) =>
  taxonomy.pendingHistory.filter(history => history.concept === conceptName)

const getConceptPrimaryName = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return concept?.name
}

const getRoot = taxonomy => taxonomy?.root

const filterTaxonomyRanks = (taxonomy, field, otherValue) =>
  filterRanks(taxonomy.ranks, field, otherValue)

const fetchTaxonomyHistory = async apiPayload => {
  const [approvedHistory, pendingHistory] = await Promise.all([
    apiPayload(fetchHistory, 'approved'),
    apiPayload(fetchHistory, 'pending'),
  ])
  return {
    approvedHistory,
    pendingHistory,
  }
}

const loadTaxonomy = async apiPayload => {
  const [root, names, ranks, { approvedHistory, pendingHistory }] = await Promise.all([
    apiPayload(fetchRoot),
    apiPayload(fetchNames),
    apiPayload(fetchRanks),
    fetchTaxonomyHistory(apiPayload),
  ])

  const aliasMap = root.alternateNames.reduce((acc, name) => {
    acc[name] = root.name
    return acc
  }, {})

  const taxonomy = {
    aliasMap,
    approvedHistory,
    concepts: { [root.name]: root },
    names,
    pendingHistory,
    ranks,
    root,
  }

  const { taxonomy: taxonomyWithRoot } = await loadTaxonomyConcept(
    apiPayload,
    taxonomy,
    root.name,
    true
  )

  const initialSelected = selectedStore.get()
  if (!initialSelected) {
    return { taxonomy: taxonomyWithRoot }
  }

  const conceptName = initialSelected.concept
  if (conceptName === taxonomy.root.name) {
    return { taxonomy: taxonomyWithRoot }
  }

  if (!names.includes(conceptName)) {
    selectedStore.set({ ...initialSelected, concept: taxonomy.root.name })
    return { taxonomy: taxonomyWithRoot }
  }

  const { taxonomy: taxonomyWithConcept } = await loadTaxonomyConcept(
    apiPayload,
    taxonomyWithRoot,
    conceptName,
    true
  )

  return { taxonomy: taxonomyWithConcept }
}

const loadTaxonomyConcept = async (apiPayload, taxonomy, conceptName, updatable = false) => {
  const existingConcept = getConcept(taxonomy, conceptName)
  if (!incompleteTaxonomy(existingConcept)) {
    return { taxonomy }
  }

  let updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }

  await loadConcept(apiPayload, updatableTaxonomy, conceptName)

  const updatableConcept = getConcept(updatableTaxonomy, conceptName)
  await loadConceptChildren(apiPayload, updatableTaxonomy, updatableConcept)

  await loadConceptGrandChildren(apiPayload, updatableTaxonomy, updatableConcept)

  await loadConceptParent(apiPayload, updatableTaxonomy, updatableConcept)

  if (updatableConcept.parent === null) {
    return { taxonomy: updatableTaxonomy }
  }
  return loadTaxonomyConcept(apiPayload, updatableTaxonomy, updatableConcept.parent.name, true)
}

const loadConcept = async (apiPayload, updatableTaxonomy, conceptName) => {
  if (updatableTaxonomy.concepts[conceptName]) {
    return
  }

  const updatableConcept = await apiPayload(fetchConcept, conceptName)
  updatableConcept.raw = false
  addConceptAndAlternateNames(updatableTaxonomy, updatableConcept)
}

// Loads all concept children, skipping children already in taxonomy.
const loadConceptChildren = async (apiPayload, updatableTaxonomy, updatableConcept) => {
  if (updatableConcept.children) {
    return { children: updatableConcept.children }
  }

  const apiChildren = await apiPayload(fetchConceptChildren, updatableConcept.name)

  const children = apiChildren.map(apiChild => {
    if (updatableTaxonomy.concepts[apiChild.name]?.children) {
      return { ...updatableTaxonomy.concepts[apiChild.name] }
    }
    const updatableChild = { ...apiChild }
    updatableChild.parent = updatableConcept

    addConceptAndAlternateNames(updatableTaxonomy, updatableChild)

    return updatableChild
  })

  updatableConcept.children = children
  addConceptAndAlternateNames(updatableTaxonomy, updatableConcept)
}

const loadConceptDescendants = async (apiPayload, taxonomy, concept, updatable = false) => {
  const updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }
  const updatableConcept = { ...concept }

  await loadConceptChildren(apiPayload, updatableTaxonomy, updatableConcept)

  if (updatableConcept.children) {
    for (const child of updatableConcept.children) {
      await loadConceptDescendants(apiPayload, updatableTaxonomy, child, true)
    }
  }

  return { taxonomy: updatableTaxonomy }
}

const loadConceptGrandChildren = async (apiPayload, updatableTaxonomy, updatableConcept) => {
  if (!updatableConcept.children.some(child => !child.children)) {
    return
  }

  const loadConceptChildrenPromises = updatableConcept.children.map(async child => {
    if (!child.children) {
      const updatableChild = { ...child }
      await loadConceptChildren(apiPayload, updatableTaxonomy, updatableChild)
      return updatableChild
    }
    return child
  })
  updatableConcept.children = await Promise.all(loadConceptChildrenPromises)
}

const loadConceptParent = async (apiPayload, updatableTaxonomy, updatableConcept) => {
  if (updatableConcept.name === updatableTaxonomy.root.name) {
    updatableConcept.parent = null
    return
  }

  if (updatableConcept.parent) {
    return
  }

  const updatableParent = await apiPayload(fetchConceptParent, updatableConcept.name)

  if (updatableTaxonomy.concepts[updatableParent.name]) {
    updatableConcept.parent = updatableTaxonomy.concepts[updatableParent.name]
    addConceptAndAlternateNames(updatableTaxonomy, updatableConcept)

    return
  }

  addConceptAndAlternateNames(updatableTaxonomy, updatableParent)
  updatableConcept.parent = updatableParent

  await loadConceptChildren(apiPayload, updatableTaxonomy, updatableParent)
}

const loadConceptAliases = async (apiPayload, taxonomy, concept) => {
  if (concept?.aliases) {
    return { taxonomy }
  }

  const rawNames = await apiPayload(fetchConceptNames, concept?.name)
  const aliases = orderedAliases(rawNames)

  const updatedConcept = {
    ...concept,
    aliases,
  }
  const updatedTaxonomy = {
    ...taxonomy,
    concepts: { ...taxonomy.concepts, [concept.name]: updatedConcept },
  }

  return { taxonomy: updatedTaxonomy }
}

const refreshConcept = async (apiPayload, taxonomy, concept, updateInfo) => {
  const { hasUpdated } = updateInfo

  const updatableTaxonomy = {
    aliasMap: { ...taxonomy.aliasMap },
    concepts: Object.fromEntries(
      Object.entries(taxonomy.concepts).filter(([name]) => name !== concept.name)
    ),
    ranks: [...taxonomy.ranks],
  }

  const updatableConcept = await conceptRefresh(apiPayload, updatableTaxonomy, concept, updateInfo)

  await refreshHistory(apiPayload, updatableTaxonomy)

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

const refreshHistory = async (apiPayload, updatableTaxonomy) => {
  const [approvedHistory, pendingHistory] = await Promise.all([
    apiPayload(fetchHistory, 'approved'),
    apiPayload(fetchHistory, 'pending'),
  ])
  updatableTaxonomy.approvedHistory = approvedHistory
  updatableTaxonomy.pendingHistory = pendingHistory
}

// const refreshNames = async (apiPayload, updatableTaxonomy, updateValue) => {
//   if (updateValue('aliases')) {
//     const names = await apiPayload(fetchNames)
//     updatableTaxonomy.names = names
//   }
// }

const findRootConcept = (root, conceptName) => {
  const findConcept = (node, name) => {
    if (node.name === name) {
      return node
    }

    if (node.children) {
      for (const child of node.children) {
        const found = findConcept(child, name)
        if (found) {
          return found
        }
      }
    }

    return null
  }

  return findConcept(root, conceptName)
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

export {
  deleteConcept,
  filterTaxonomyRanks,
  getConcept,
  getConceptPendingHistory,
  getConceptPrimaryName,
  getNames,
  getRoot,
  loadTaxonomyConcept as load,
  loadConceptAliases,
  loadConceptDescendants,
  loadTaxonomy,
  refreshConcept,
  refreshHistory,
}
