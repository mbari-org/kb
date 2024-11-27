import {
  fetchChildren,
  fetchConcept,
  fetchParent,
} from "@/lib/services/oni/api/concept"

import { fetchPendingHistory } from "@/lib/services/oni/api/history"

import { fetchNames, fetchRoot } from "@/lib/services/oni/api/taxonomy"

import selectedStore from "@/lib/store/selected"

const loadDescendants = async (concept, taxonomy, updatable = false) => {
  const updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }
  const updatableConcept = { ...concept }

  await loadChildren(updatableConcept, updatableTaxonomy)

  if (updatableConcept.children) {
    for (const child of updatableConcept.children) {
      await loadDescendants(child, updatableTaxonomy, true)
    }
  }

  return { taxonomy: updatableTaxonomy }
}

const getConcept = (conceptName, taxonomy) => {
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
  const names = await fetchNames(config)
  const root = await fetchRoot(config)
  const pendingHistory = await fetchPendingHistory(config)

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

  const { taxonomy: taxonomyWithRoot } = await load(root.name, taxonomy, true)

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
    conceptName,
    taxonomyWithRoot,
    true
  )

  return { taxonomy: taxonomyWithConcept }
}

const load = async (conceptName, taxonomy, updatable = false) => {
  if (!needsUpdate(getConcept(conceptName, taxonomy))) {
    return { taxonomy }
  }

  let updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }

  await loadConcept(conceptName, updatableTaxonomy)

  const updatableConcept = updatableTaxonomy.concepts[conceptName]
  await loadChildren(updatableConcept, updatableTaxonomy)

  await loadGrandChildren(updatableConcept, updatableTaxonomy)

  await loadParent(updatableConcept, updatableTaxonomy)

  if (updatableConcept.parent === null) {
    return { taxonomy: updatableTaxonomy }
  }
  return load(updatableConcept.parent.name, updatableTaxonomy, true)
}

const loadConcept = async (conceptName, updatableTaxonomy) => {
  if (!updatableTaxonomy.concepts[conceptName]) {
    const concept = await fetchConcept(conceptName, updatableTaxonomy.config)
    updatableTaxonomy.concepts[conceptName] = concept
    addAliases(updatableTaxonomy, concept)
  }
}

// Loads all concept children, skipping children already in taxonomy.
const loadChildren = async (updatableConcept, updatableTaxonomy) => {
  if (updatableConcept.children) {
    return { children: updatableConcept.children }
  }

  const apiChildren = await fetchChildren(
    updatableConcept.name,
    updatableTaxonomy.config
  )

  const children = apiChildren.map(apiChild => {
    if (updatableTaxonomy.concepts[apiChild.name]?.children) {
      return { ...updatableTaxonomy.concepts[apiChild.name] }
    }
    const updatableChild = { ...apiChild }
    updatableChild.parent = updatableConcept

    updatableTaxonomy.concepts[updatableChild.name] = updatableChild
    addAliases(updatableTaxonomy, updatableChild)

    return updatableChild
  })

  updatableConcept.children = children
  updatableTaxonomy.concepts[updatableConcept.name] = updatableConcept
  addAliases(updatableTaxonomy, updatableConcept)
}

const loadGrandChildren = async (updatableConcept, updatableTaxonomy) => {
  if (!updatableConcept.children.some(child => !child.children)) {
    return
  }

  const loadChildrenPromises = updatableConcept.children.map(async child => {
    if (!child.children) {
      const updatableChild = { ...child }
      await loadChildren(updatableChild, updatableTaxonomy)
      return updatableChild
    }
    return child
  })
  updatableConcept.children = await Promise.all(loadChildrenPromises)
}

const loadParent = async (updatableConcept, updatableTaxonomy) => {
  if (updatableConcept.name === updatableTaxonomy.root.name) {
    updatableConcept.parent = null
    return
  }

  if (updatableConcept.parent) {
    return
  }

  const parent = await fetchParent(
    updatableConcept.name,
    updatableTaxonomy.config
  )

  if (updatableTaxonomy.concepts[parent.name]) {
    updatableConcept.parent = updatableTaxonomy.concepts[parent.name]
    updatableTaxonomy.concepts[updatableConcept.name] = updatableConcept
    return
  }

  updatableTaxonomy.concepts[parent.name] = parent
  updatableConcept.parent = parent
  addAliases(updatableTaxonomy, parent)

  await loadChildren(parent, updatableTaxonomy)
}

const needsUpdate = concept => {
  return (
    !concept ||
    !concept.children ||
    !concept.parent ||
    concept.children.some(child => !child.children)
  )
}

const addAliases = (updatableTaxonomy, concept) => {
  if (0 < concept.alternateNames?.length) {
    const aliases = { ...updatableTaxonomy.aliases }
    concept.alternateNames.forEach(name => {
      aliases[name] = concept.name
    })
    updatableTaxonomy.aliases = aliases
  }
}

export {
  getConcept,
  getNextSibling,
  getPrevSibling,
  load,
  loadDescendants,
  loadTaxonomy,
  needsUpdate,
}
