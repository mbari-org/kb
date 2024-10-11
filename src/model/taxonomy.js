import fetchChildren from "@/lib/services/oni/concept/children"
import fetchConcept from "@/lib/services/oni/concept/concept"
import fetchParent from "@/lib/services/oni/concept/parent"
import fetchRoot from "@/lib/services/oni/concept/root"
import { ChildCare } from "@mui/icons-material"

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

  if (conceptName === taxonomy.root.name) {
    return { taxonomy: updatableTaxonomy }
  }

  const parent = updatableConcept.parent
  if (parent.children) {
    return { taxonomy: updatableTaxonomy }
  }

  return load(updatableTaxonomy, parent.name, true)
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
    return updatableChild
  })

  updatableConcept.children = children
  updatableTaxonomy.concepts[updatableConcept.name] = updatableConcept

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
  updatableConcept.parent = parent
  updatableTaxonomy.concepts[conceptName] = updatableConcept

  const { error: childrenError } = await loadChildren(updatableTaxonomy, parent)
  if (childrenError) {
    return {
      error: childrenError,
      taxonomy: updatableTaxonomy,
    }
  }

  return {}
}

const loadRoot = async config => {
  const { error: rootError, root: apiRoot } = await fetchRoot(config)
  if (rootError) {
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

  if (loadError) {
    return { error: loadError }
  }

  const rootName = root.name

  const rootWithChildren = taxonomyWithRoot.concepts[rootName]

  return { taxonomy: { ...taxonomyWithRoot, root: rootWithChildren } }
}

const needsUpdate = (taxonomy, conceptName) => {
  const concept = taxonomy.concepts[conceptName]
  if (!concept || !concept.children || !concept.parent) {
    return true
  }
  return concept.children.some(child => !child.children)

  // if (includeGrandChildren) {
  //   return concept.children.reduce((acc, child) => acc && !child.children, false)
  // }

  // return false
}
export { load, loadRoot, needsUpdate }
