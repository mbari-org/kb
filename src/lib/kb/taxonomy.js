import {
  fetchConcept,
  fetchChildren as fetchConceptChildren,
  fetchNames as fetchConceptNames,
  fetchParent as fetchConceptParent,
} from '@/lib/services/oni/api/concept'

import { fetchHistory } from '@/lib/services/oni/api/history'
import { fetchNames, fetchRanks, fetchRoot } from '@/lib/services/oni/api/taxonomy'

import selectedStore from '@/lib/store/selected'

import { incompleteTaxonomy } from './concept'
import { orderedAliases } from './concept/aliases'
import { filterRanks } from './concept/rank'

const apiCall = async fetchFn => {
  const { error, payload } = await fetchFn()
  if (error) {
    throw new Error(`${error.title}: ${error.message}\n${error.detail}`)
  }
  return payload
}

const deleteConcept = (taxonomy, conceptName) => {
  const { [conceptName]: deletedConcept, ...remainingConcepts } = taxonomy.concepts
  const remainingAliases = { ...taxonomy.aliases }
  deletedConcept.alternateNames.forEach(name => delete remainingAliases[name])

  const updatedTaxonomy = {
    ...taxonomy,
    aliases: remainingAliases,
    concepts: remainingConcepts,
  }

  if (deletedConcept?.parent) {
    const parentConcept = updatedTaxonomy.concepts[deletedConcept.parent.name]
    parentConcept.children = parentConcept.children.filter(child => child.name !== conceptName)
  }

  return { taxonomy: updatedTaxonomy }
}

const getConcept = (taxonomy, conceptName) => {
  let concept = taxonomy?.concepts[conceptName]
  if (concept) {
    return concept
  }

  const aliasedName = taxonomy.aliases[conceptName]
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

const fetchTaxonomyHistory = async config => {
  const [approvedHistory, pendingHistory] = await Promise.all([
    apiCall(() => fetchHistory(config, 'approved')),
    apiCall(() => fetchHistory(config, 'pending')),
  ])
  return {
    approvedHistory,
    pendingHistory,
  }
}

const loadTaxonomy = async config => {
  const [root, names, ranks, { approvedHistory, pendingHistory }] = await Promise.all([
    apiCall(() => fetchRoot(config)),
    apiCall(() => fetchNames(config)),
    apiCall(() => fetchRanks(config)),
    fetchTaxonomyHistory(config),
  ])

  const aliases = root.alternateNames.reduce((acc, name) => {
    acc[name] = root.name
    return acc
  }, {})

  const taxonomy = {
    aliases,
    approvedHistory,
    config,
    names,
    pendingHistory,
    ranks,
    root,
    concepts: { [root.name]: root },
  }

  const { taxonomy: taxonomyWithRoot } = await loadTaxonomyConcept(taxonomy, root.name, true)

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
    taxonomyWithRoot,
    conceptName,
    true
  )

  return { taxonomy: taxonomyWithConcept }
}

const loadTaxonomyConcept = async (taxonomy, conceptName, updatable = false) => {
  const existingConcept = getConcept(taxonomy, conceptName)
  if (!incompleteTaxonomy(existingConcept)) {
    return { taxonomy }
  }

  let updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }

  await loadConcept(updatableTaxonomy, conceptName)

  const updatableConcept = getConcept(updatableTaxonomy, conceptName)
  await loadConceptChildren(updatableTaxonomy, updatableConcept)

  await loadConceptGrandChildren(updatableTaxonomy, updatableConcept)

  await loadConceptParent(updatableTaxonomy, updatableConcept)

  if (updatableConcept.parent === null) {
    return { taxonomy: updatableTaxonomy }
  }
  return loadTaxonomyConcept(updatableTaxonomy, updatableConcept.parent.name, true)
}

const loadConcept = async (updatableTaxonomy, conceptName) => {
  if (updatableTaxonomy.concepts[conceptName]) {
    return
  }

  const updatableConcept = await apiCall(() => fetchConcept(updatableTaxonomy.config, conceptName))
  updatableConcept.raw = false
  addConceptAndAliases(updatableTaxonomy, updatableConcept)
}

// Loads all concept children, skipping children already in taxonomy.
const loadConceptChildren = async (updatableTaxonomy, updatableConcept) => {
  if (updatableConcept.children) {
    return { children: updatableConcept.children }
  }

  const apiChildren = await apiCall(() =>
    fetchConceptChildren(updatableTaxonomy.config, updatableConcept.name)
  )

  const children = apiChildren.map(apiChild => {
    if (updatableTaxonomy.concepts[apiChild.name]?.children) {
      return { ...updatableTaxonomy.concepts[apiChild.name] }
    }
    const updatableChild = { ...apiChild }
    updatableChild.parent = updatableConcept

    addConceptAndAliases(updatableTaxonomy, updatableChild)

    return updatableChild
  })

  updatableConcept.children = children
  addConceptAndAliases(updatableTaxonomy, updatableConcept)
}

const loadConceptDescendants = async (taxonomy, concept, updatable = false) => {
  const updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }
  const updatableConcept = { ...concept }

  await loadConceptChildren(updatableTaxonomy, updatableConcept)

  if (updatableConcept.children) {
    for (const child of updatableConcept.children) {
      await loadConceptDescendants(updatableTaxonomy, child, true)
    }
  }

  return { taxonomy: updatableTaxonomy }
}

const loadConceptGrandChildren = async (updatableTaxonomy, updatableConcept) => {
  if (!updatableConcept.children.some(child => !child.children)) {
    return
  }

  const loadConceptChildrenPromises = updatableConcept.children.map(async child => {
    if (!child.children) {
      const updatableChild = { ...child }
      await loadConceptChildren(updatableTaxonomy, updatableChild)
      return updatableChild
    }
    return child
  })
  updatableConcept.children = await Promise.all(loadConceptChildrenPromises)
}

const loadConceptParent = async (updatableTaxonomy, updatableConcept) => {
  if (updatableConcept.name === updatableTaxonomy.root.name) {
    updatableConcept.parent = null
    return
  }

  if (updatableConcept.parent) {
    return
  }

  const updatableParent = await apiCall(() =>
    fetchConceptParent(updatableTaxonomy.config, updatableConcept.name)
  )

  if (updatableTaxonomy.concepts[updatableParent.name]) {
    updatableConcept.parent = updatableTaxonomy.concepts[updatableParent.name]
    addConceptAndAliases(updatableTaxonomy, updatableConcept)

    return
  }

  addConceptAndAliases(updatableTaxonomy, updatableParent)
  updatableConcept.parent = updatableParent

  await loadConceptChildren(updatableTaxonomy, updatableParent)
}

const loadConceptAliases = async (taxonomy, concept) => {
  if (concept?.aliases) {
    return { taxonomy }
  }

  const rawNames = await apiCall(() => fetchConceptNames(taxonomy.config, concept?.name))
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

const addConceptAndAliases = async (updatableTaxonomy, updatableConcept) => {
  updatableTaxonomy.concepts[updatableConcept.name] = updatableConcept

  // add aliases
  if (0 < updatableConcept.alternateNames?.length) {
    const aliases = { ...updatableTaxonomy.aliases }
    updatableConcept.alternateNames.forEach(name => {
      aliases[name] = updatableConcept.name
    })
    updatableTaxonomy.aliases = aliases
  }
}

const refreshConcept = async (taxonomy, conceptName) => {
  const currentConcept = getConcept(taxonomy, conceptName)
  if (!currentConcept) {
    return
  }

  const [apiConcept, children, rawNames, approvedHistory, pendingHistory, names] =
    await Promise.all([
      apiCall(() => fetchConcept(taxonomy.config, conceptName)),
      apiCall(() => fetchConceptChildren(taxonomy.config, conceptName)),
      apiCall(() => fetchConceptNames(taxonomy.config, conceptName)),
      apiCall(() => fetchHistory(taxonomy.config, 'approved')),
      apiCall(() => fetchHistory(taxonomy.config, 'pending')),
      apiCall(() => fetchNames(taxonomy.config)),
    ])
  const updatableTaxonomy = {
    ...taxonomy,
    approvedHistory,
    pendingHistory,
    names,
  }
  currentConcept.alternateNames.forEach(name => delete updatableTaxonomy.aliases[name])

  const conceptChildren = children.map(child => {
    if (updatableTaxonomy.concepts[child.name]) {
      return { ...updatableTaxonomy.concepts[child.name] }
    }
    return child
  })

  apiConcept.raw = false
  apiConcept.aliases = orderedAliases(rawNames)
  apiConcept.alternateNames = apiConcept.aliases.map(alias => alias.name)
  apiConcept.alternateNames.forEach(name => {
    updatableTaxonomy.aliases[name] = apiConcept.name
  })
  apiConcept.children = conceptChildren
  updatableTaxonomy.concepts[conceptName] = apiConcept

  return { taxonomy: updatableTaxonomy }
}

const refreshHistory = async (taxonomy, _conceptName) => {
  const [approvedHistory, pendingHistory] = await Promise.all([
    apiCall(() => fetchHistory(taxonomy.config, 'approved')),
    apiCall(() => fetchHistory(taxonomy.config, 'pending')),
  ])
  return {
    ...taxonomy,
    approvedHistory,
    pendingHistory,
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
