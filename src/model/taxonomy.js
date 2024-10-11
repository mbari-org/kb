import fetchChildren from "@/lib/services/oni/concept/children"
import fetchConcept from "@/lib/services/oni/concept/concept"
import fetchParent from "@/lib/services/oni/concept/parent"
import fetchRoot from "@/lib/services/oni/concept/root"

// nullify a fetched concept's arrays (which are all [] from the API) to allow taxonomy introspection
// to "know" if the concept has already been "filled" (which requires additional API calls).
const fromApi = concept => ({
  ...concept,
  linkRealizations: null,
  media: null,
  references: null,
})

const load = async (taxonomy, conceptName, updatable = false) => {
  if (!needsUpdate(taxonomy, conceptName)) {
    return { taxonomy }
  }

  let updatableTaxonomy = updatable ? taxonomy : { ...taxonomy }

  const { error: conceptError } = await loadConcept(
    updatableTaxonomy,
    conceptName
  )
  if (!!conceptError) {
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
  if (!!childrenError) {
    return {
      error: childrenError,
      taxonomy: updatableTaxonomy,
    }
  }
  const { error: parentError } = await loadParent(
    updatableTaxonomy,
    updatableConcept
  )
  if (!!parentError) {
    return {
      error: parentError,
      taxonomy: updatableTaxonomy,
    }
  }

  if (conceptName === taxonomy.root.name) {
    return { taxonomy: updatableTaxonomy }
  }

  // const concept = updatableTaxonomy.concepts[conceptName]
  const parent = updatableConcept.parent

  if (!!parent.children) {
    return { taxonomy: updatableTaxonomy }
  }

  return await load(updatableTaxonomy, parent.name, true)
}

const loadConcept = async (updatableTaxonomy, conceptName) => {
  if (!!updatableTaxonomy.concepts[conceptName]) {
    return {}
  }

  const { concept: apiConcept, error: conceptError } = await fetchConcept(
    updatableTaxonomy,
    conceptName
  )
  if (!!conceptError) {
    return { error: conceptError }
  }

  const concept = fromApi(apiConcept)
  updatableTaxonomy.concepts[conceptName] = concept

  return {}
}

// Loads all concept children, skipping children already in taxonomy.
const loadChildren = async (
  updatableTaxonomy,
  updatableConcept,
  includeGrandChildren = true
) => {
  if (!!updatableConcept.children) {
    return { children: updatableConcept.children }
  }

  const { children: apiChildren, error: childrenError } = await fetchChildren(
    updatableTaxonomy,
    updatableConcept.name
  )
  if (!!childrenError) {
    return { error: childrenError }
  }

  const updatableChildren = apiChildren.map(apiChild => {
    if (!!updatableTaxonomy.concepts[apiChild.name]?.children) {
      return { ...updatableTaxonomy.concepts[apiChild.name] }
    }
    const updatableChild = fromApi(apiChild)
    updatableChild.parent = updatableConcept

    updatableTaxonomy.concepts[updatableChild.name] = updatableChild
    return updatableChild
  })

  updatableConcept.children = updatableChildren
  updatableTaxonomy.concepts[updatableConcept.name] = updatableConcept

  if (includeGrandChildren) {
    await Promise.all(
      updatableChildren.map(async updatableChild => {
        await loadChildren(updatableTaxonomy, updatableChild, false)
      })
    )
  }

  return {}
}

const loadParent = async (updatableTaxonomy, updatableConcept) => {
  if (updatableConcept.name === updatableTaxonomy.root.name) {
    return {}
  }

  if (!!updatableConcept.parent) {
    return {}
  }

  const { error: parentError, parent: apiParent } = await fetchParent(
    updatableTaxonomy,
    updatableConcept.name
  )
  if (!!parentError) {
    return { error: parentError }
  }

  if (!!updatableTaxonomy.concepts[apiParent.name]) {
    updatableConcept.parent = updatableTaxonomy.concepts[apiParent.name]
    updatableTaxonomy.concepts[updatableConcept.name] = updatableConcept
    return {}
  }

  const parent = fromApi(apiParent)
  updatableConcept.parent = parent
  updatableTaxonomy.concepts[conceptName] = updatableConcept

  const { error: childrenError } = await loadChildren(updatableTaxonomy, parent)
  if (!!childrenError) {
    return {
      error: childrenError,
      taxonomy: updatableTaxonomy,
    }
  }

  return {}
}

const loadRoot = async config => {
  const { error: rootError, root: apiRoot } = await fetchRoot(config)
  if (!!rootError) {
    return { error: rootError }
  }

  const root = fromApi(apiRoot)
  const taxonomy = {
    config,
    root,
    concepts: { [root.name]: root },
  }

  const { error: loadError, taxonomy: taxonomyWithRoot } = await load(
    taxonomy,
    root.name
  )

  if (!!loadError) {
    return { error: loadError }
  }

  const rootName = root.name

  const rootWithChildren = taxonomyWithRoot.concepts[rootName]

  return { taxonomy: { ...taxonomyWithRoot, root: rootWithChildren } }
}

const needsUpdate = (taxonomy, conceptName, includeGrandChildren = false) => {
  const concept = taxonomy.concepts[conceptName]
  if (!concept || !concept.children || !concept.parent) {
    return true
  }

  if (includeGrandChildren) {
    return concept.children.reduce(
      (acc, child) => acc && !!taxonomy.concepts[child],
      true
    )
  }

  return false
}
export { load, loadRoot, needsUpdate }
