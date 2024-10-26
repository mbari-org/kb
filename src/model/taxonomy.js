import {
  fetchChildren,
  fetchConcept,
  fetchParent,
} from "@/lib/services/oni/api/concept"

import {
  fetchNames,
  fetchPendingHistory,
  fetchRoot,
} from "@/lib/services/oni/api/taxonomy"

import selectedStore from "@/lib/store/selected"

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
  if (!needsUpdate(getConcept(taxonomy, conceptName))) {
    return { taxonomy }
  }

  let updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }

  await loadConcept(updatableTaxonomy, conceptName)

  const updatableConcept = updatableTaxonomy.concepts[conceptName]
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
    const concept = await fetchConcept(updatableTaxonomy, conceptName)
    updatableTaxonomy.concepts[conceptName] = concept
    addAliases(updatableTaxonomy, concept)
  }
}

// Loads all concept children, skipping children already in taxonomy.
const loadChildren = async (updatableTaxonomy, updatableConcept) => {
  if (updatableConcept.children) {
    return { children: updatableConcept.children }
  }

  const apiChildren = await fetchChildren(
    updatableTaxonomy,
    updatableConcept.name
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

  const parent = await fetchParent(updatableTaxonomy, updatableConcept.name)

  if (updatableTaxonomy.concepts[parent.name]) {
    updatableConcept.parent = updatableTaxonomy.concepts[parent.name]
    updatableTaxonomy.concepts[updatableConcept.name] = updatableConcept
    return
  }

  updatableTaxonomy.concepts[parent.name] = parent
  updatableConcept.parent = parent
  addAliases(updatableTaxonomy, parent)

  await loadChildren(updatableTaxonomy, parent)
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
