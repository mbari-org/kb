import fetchChildren from "@/lib/services/oni/concept/children"
import fetchConcept from "@/lib/services/oni/concept/concept"
import fetchNames from "@/lib/services/oni/concept/names"
import fetchParent from "@/lib/services/oni/concept/parent"
import fetchRoot from "@/lib/services/oni/concept/root"

const getConcept = (taxonomy, name) => {
  let concept = taxonomy?.concepts[name]
  if (concept) {
    return needsUpdate(concept) ? null : concept
  }

  const aliasedName = taxonomy.aliases[name]
  if (aliasedName) {
    return taxonomy.concepts[aliasedName] || null
  }

  return null
}

// nullify a fetched concept's arrays (which are all [] from the API) to allow taxonomy introspection
// to "know" if the concept has already been "filled" (which requires additional API calls).
const fromApi = concept => ({
  ...concept,
  linkRealizations: null,
  media: null,
  references: null,
})

const loadTaxonomy = async (config, conceptName) => {
  const { error: namesError, names } = await fetchNames(config)
  if (namesError) {
    return { error: namesError }
  }

  const { error: rootError, root: apiRoot } = await fetchRoot(config)
  if (rootError) {
    return { error: rootError }
  }

  const root = fromApi(apiRoot)
  const aliases = root.alternateNames.reduce((acc, name) => {
    acc[name] = root.name
    return acc
  }, {})

  const taxonomy = {
    aliases,
    config,
    names,
    root,
    concepts: { [root.name]: root },
  }

  const { error: loadRootError, taxonomy: taxonomyWithRoot } = await load(
    taxonomy,
    root.name,
    true
  )
  if (loadRootError) {
    return { error: loadRootError }
  }

  if (!conceptName) {
    return { taxonomy: taxonomyWithRoot }
  }

  const { error: loadConceptError, taxonomy: taxonomyWithConcept } = await load(
    taxonomyWithRoot,
    conceptName,
    true
  )
  if (loadConceptError) {
    return { error: loadConceptError }
  }

  return { taxonomy: taxonomyWithConcept }
}

const load = async (taxonomy, conceptName, updatable = false) => {
  if (!needsUpdate(getConcept(taxonomy, conceptName))) {
    return { taxonomy }
  }

  let updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }

  const { error: conceptError } = await loadConcept(
    updatableTaxonomy,
    conceptName
  )
  if (conceptError) {
    return {
      error: conceptError,
      taxonomy: updatableTaxonomy,
    }
  }

  const updatableConcept = updatableTaxonomy.concepts[conceptName]
  const { error: childrenError } = await loadChildren(
    updatableTaxonomy,
    updatableConcept
  )
  if (childrenError) {
    return {
      error: childrenError,
      taxonomy: updatableTaxonomy,
    }
  }

  const { error: grandChildrenError } = await loadGrandChildren(
    updatableTaxonomy,
    updatableConcept
  )
  if (grandChildrenError) {
    return {
      error: grandChildrenError,
      taxonomy: updatableTaxonomy,
    }
  }

  const { error: parentError } = await loadParent(
    updatableTaxonomy,
    updatableConcept
  )
  if (parentError) {
    return {
      error: parentError,
      taxonomy: updatableTaxonomy,
    }
  }

  if (updatableConcept.parent === null) {
    return { taxonomy: updatableTaxonomy }
  }

  return load(updatableTaxonomy, updatableConcept.parent.name, true)
}

const loadConcept = async (updatableTaxonomy, conceptName) => {
  if (updatableTaxonomy.concepts[conceptName]) {
    return {}
  }

  const { concept: apiConcept, error: conceptError } = await fetchConcept(
    updatableTaxonomy,
    conceptName
  )
  if (conceptError) {
    return { error: conceptError }
  }

  const concept = fromApi(apiConcept)
  updatableTaxonomy.concepts[conceptName] = concept
  addAliases(updatableTaxonomy, concept)

  return {}
}

// Loads all concept children, skipping children already in taxonomy.
const loadChildren = async (updatableTaxonomy, updatableConcept) => {
  if (updatableConcept.children) {
    return { children: updatableConcept.children }
  }

  const { children: apiChildren, error: childrenError } = await fetchChildren(
    updatableTaxonomy,
    updatableConcept.name
  )
  if (childrenError) {
    return { error: childrenError }
  }

  const children = apiChildren.map(apiChild => {
    if (updatableTaxonomy.concepts[apiChild.name]?.children) {
      return { ...updatableTaxonomy.concepts[apiChild.name] }
    }
    const updatableChild = fromApi(apiChild)
    updatableChild.parent = updatableConcept

    updatableTaxonomy.concepts[updatableChild.name] = updatableChild
    addAliases(updatableTaxonomy, updatableChild)

    return updatableChild
  })

  updatableConcept.children = children
  updatableTaxonomy.concepts[updatableConcept.name] = updatableConcept
  addAliases(updatableTaxonomy, updatableConcept)

  return {}
}

const loadGrandChildren = async (updatableTaxonomy, updatableConcept) => {
  if (!updatableConcept.children.some(child => !child.children)) {
    return {}
  }

  let error
  const loadChildrenPromises = updatableConcept.children.map(async child => {
    if (!child.children) {
      const updatableChild = { ...child }
      const { error: childrenError } = await loadChildren(
        updatableTaxonomy,
        updatableChild
      )
      if (childrenError) {
        error = childrenError
      }
      return updatableChild
    }
    return child
  })
  const children = await Promise.all(loadChildrenPromises)

  if (error) {
    return { error }
  }

  updatableConcept.children = children

  return {}
}

const loadParent = async (updatableTaxonomy, updatableConcept) => {
  if (updatableConcept.name === updatableTaxonomy.root.name) {
    updatableConcept.parent = null
    return {}
  }

  if (updatableConcept.parent) {
    return {}
  }

  const { error: parentError, parent: apiParent } = await fetchParent(
    updatableTaxonomy,
    updatableConcept.name
  )
  if (parentError) {
    return { error: parentError }
  }

  if (updatableTaxonomy.concepts[apiParent.name]) {
    updatableConcept.parent = updatableTaxonomy.concepts[apiParent.name]
    updatableTaxonomy.concepts[updatableConcept.name] = updatableConcept
    return {}
  }

  const parent = fromApi(apiParent)
  updatableTaxonomy.concepts[parent.name] = parent
  addAliases(updatableTaxonomy, parent)

  updatableConcept.parent = parent

  const { error: childrenError } = await loadChildren(updatableTaxonomy, parent)
  if (childrenError) {
    return {
      error: childrenError,
      taxonomy: updatableTaxonomy,
    }
  }

  return {}
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

export { getConcept, load, loadTaxonomy }
