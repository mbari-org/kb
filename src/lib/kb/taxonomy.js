import {
  fetchChildren,
  fetchConcept,
  fetchParent,
} from "@/lib/services/oni/api/concept"

import { fetchPendingHistory } from "@/lib/services/oni/api/history"

import { fetchNames, fetchRoot } from "@/lib/services/oni/api/taxonomy"

import selectedStore from "@/lib/store/selected"

const apiCall = async fetchFn => {
  const { error, payload } = await fetchFn()
  if (error) {
    throw new Error(`${error.title}: ${error.message}\n${error.detail}`)
  }
  return payload
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

const getConceptNames = taxonomy => {
  return taxonomy.names
}

const getConceptPendingHistory = (taxonomy, conceptName) => {
  return taxonomy.pendingHistory.filter(
    history => history.concept === conceptName
  )
}

const getConceptPrimaryName = (taxonomy, conceptName) => {
  const concept = getConcept(taxonomy, conceptName)
  return concept?.name
}

const getNextSibling = concept => {
  if (concept && concept.parent) {
    const siblings = concept.parent.children
    const currentIndex = siblings.findIndex(
      sibling => sibling.name === concept.name
    )

    if (currentIndex !== -1 && currentIndex < siblings.length - 1) {
      return siblings[currentIndex + 1]
    }
  }
  return null
}

const getPrevSibling = concept => {
  const { parent } = concept

  if (parent) {
    const siblings = parent.children
    const currentIndex = siblings.findIndex(
      sibling => sibling.name === concept.name
    )

    if (currentIndex > 0) {
      return siblings[currentIndex - 1]
    }
  }

  // If no previous sibling, return null
  return null
}

const loadTaxonomy = async config => {
  const root = await apiCall(() => fetchRoot(config))
  const names = await apiCall(() => fetchNames(config))
  const pendingHistory = await apiCall(() => fetchPendingHistory(config))

  const aliases = root.alternateNames.reduce((acc, name) => {
    acc[name] = root.name
    return acc
  }, {})

  const taxonomy = {
    aliases,
    config,
    names,
    pendingHistory,
    root,
    concepts: { [root.name]: root },
  }

  const { taxonomy: taxonomyWithRoot } = await load(taxonomy, root.name, true)

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

  const { taxonomy: taxonomyWithConcept } = await load(
    taxonomyWithRoot,
    conceptName,
    true
  )

  return { taxonomy: taxonomyWithConcept }
}

const load = async (taxonomy, conceptName, updatable = false) => {
  const existingConcept = getConcept(taxonomy, conceptName)
  if (!needsUpdate(existingConcept)) {
    return { taxonomy }
  }

  let updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }

  await loadConcept(updatableTaxonomy, conceptName)

  const updatableConcept = getConcept(updatableTaxonomy, conceptName)
  await loadChildren(updatableTaxonomy, updatableConcept)

  await loadGrandChildren(updatableTaxonomy, updatableConcept)

  await loadParent(updatableTaxonomy, updatableConcept)

  if (updatableConcept.parent === null) {
    return { taxonomy: updatableTaxonomy }
  }
  return load(updatableTaxonomy, updatableConcept.parent.name, true)
}

const loadConcept = async (updatableTaxonomy, conceptName) => {
  if (!updatableTaxonomy.concepts[conceptName]) {
    const updatableConcept = await apiCall(() =>
      fetchConcept(updatableTaxonomy.config, conceptName)
    )

    addConcept(updatableTaxonomy, updatableConcept)
  }
}

// Loads all concept children, skipping children already in taxonomy.
const loadChildren = async (updatableTaxonomy, updatableConcept) => {
  if (updatableConcept.children) {
    return { children: updatableConcept.children }
  }

  const apiChildren = await apiCall(() =>
    fetchChildren(updatableTaxonomy.config, updatableConcept.name)
  )

  const children = apiChildren.map(apiChild => {
    if (updatableTaxonomy.concepts[apiChild.name]?.children) {
      return { ...updatableTaxonomy.concepts[apiChild.name] }
    }
    const updatableChild = { ...apiChild }
    updatableChild.parent = updatableConcept

    addConcept(updatableTaxonomy, updatableChild)

    return updatableChild
  })

  updatableConcept.children = children
  addConcept(updatableTaxonomy, updatableConcept)
}

const loadDescendants = async (taxonomy, concept, updatable = false) => {
  const updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }
  const updatableConcept = { ...concept }

  await loadChildren(updatableTaxonomy, updatableConcept)

  if (updatableConcept.children) {
    for (const child of updatableConcept.children) {
      await loadDescendants(updatableTaxonomy, child, true)
    }
  }

  return { taxonomy: updatableTaxonomy }
}

const loadGrandChildren = async (updatableTaxonomy, updatableConcept) => {
  if (!updatableConcept.children.some(child => !child.children)) {
    return
  }

  const loadChildrenPromises = updatableConcept.children.map(async child => {
    if (!child.children) {
      const updatableChild = { ...child }
      await loadChildren(updatableTaxonomy, updatableChild)
      return updatableChild
    }
    return child
  })
  updatableConcept.children = await Promise.all(loadChildrenPromises)
}

const loadParent = async (updatableTaxonomy, updatableConcept) => {
  if (updatableConcept.name === updatableTaxonomy.root.name) {
    updatableConcept.parent = null
    return
  }

  if (updatableConcept.parent) {
    return
  }

  const updatableParent = await apiCall(() =>
    fetchParent(updatableTaxonomy.config, updatableConcept.name)
  )

  if (updatableTaxonomy.concepts[updatableParent.name]) {
    updatableConcept.parent = updatableTaxonomy.concepts[updatableParent.name]
    addConcept(updatableTaxonomy, updatableConcept)

    return
  }

  addConcept(updatableTaxonomy, updatableParent)
  updatableConcept.parent = updatableParent

  await loadChildren(updatableTaxonomy, updatableParent)
}

const needsUpdate = concept => {
  return (
    !concept ||
    !concept.children ||
    !concept.parent ||
    concept.children.some(child => !child.children)
  )
}

const addConcept = async (updatableTaxonomy, updatableConcept) => {
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

const updateConcept = async (taxonomy, concept) => {
  const updatedConcepts = { ...taxonomy.concepts }
  updatedConcepts[concept.name] = concept

  const pendingHistory = await apiCall(() =>
    fetchPendingHistory(taxonomy.config)
  )

  return {
    taxonomy: { ...taxonomy, concepts: updatedConcepts, pendingHistory },
  }
}

const updateConceptName = async (taxonomy, concept, newName) => {
  const updatedConcepts = { ...taxonomy.concepts }

  // Update concept
  const updatedConcept = { ...concept, name: newName }
  delete updatedConcepts[concept.name]
  updatedConcepts[newName] = updatedConcept

  // Update parent
  if (updatedConcept.parent) {
    const parent = updatedConcepts[updatedConcept.parent.name]
    if (parent && parent.children) {
      const childIndex = parent.children.findIndex(
        child => child.name === concept.name
      )
      if (childIndex !== -1) {
        parent.children[childIndex] = updatedConcept
      }
    }
  }

  // Update children
  if (updatedConcept.children) {
    updatedConcept.children.forEach(child => {
      const childInUpdatedConcepts = updatedConcepts[child.name]
      if (childInUpdatedConcepts) {
        childInUpdatedConcepts.parent = updatedConcept
      }
    })
  }

  // Update names
  const updatedNames = [...taxonomy.names]
  const oldIndex = updatedNames.indexOf(concept.name)
  if (oldIndex !== -1) {
    updatedNames.splice(oldIndex, 1)
  }
  updatedNames.push(newName)
  updatedNames.sort()

  const pendingHistory = await apiCall(() =>
    fetchPendingHistory(taxonomy.config)
  )

  return {
    taxonomy: {
      ...taxonomy,
      concepts: updatedConcepts,
      names: updatedNames,
      pendingHistory,
    },
  }
}

export {
  getConcept,
  getConceptNames,
  getConceptPendingHistory,
  getConceptPrimaryName,
  getNextSibling,
  getPrevSibling,
  load,
  loadDescendants,
  loadTaxonomy,
  needsUpdate,
  updateConcept,
  updateConceptName,
}
