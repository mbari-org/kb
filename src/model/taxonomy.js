import getChildren from "@/lib/services/oni/concept/children"
import getConcept from "@/lib/services/oni/concept/concept"
import getParent from "@/lib/services/oni/concept/parent"
import getRoot from "@/lib/services/oni/concept/root"

// nullify arrays (which are all [] from the API) to allow taxonomy introspection
// to "know" if the concept has already been filled (which requires additional API calls).
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

  const { error: childrenError } = await loadChildren(
    updatableTaxonomy,
    conceptName
  )
  if (!!childrenError) {
    return {
      error: childrenError,
      taxonomy: updatableTaxonomy,
    }
  }
  const { error: parentError } = await loadParent(
    updatableTaxonomy,
    conceptName
  )
  if (!!parentError) {
    return {
      error: parentError,
      taxonomy: updatableTaxonomy,
    }
  }

  if (conceptName === taxonomy._root_) {
    return { taxonomy: updatableTaxonomy }
  }

  const concept = updatableTaxonomy[conceptName]
  const parent = updatableTaxonomy[concept.parent]

  if (!!parent.children) {
    return { taxonomy: updatableTaxonomy }
  }

  return await load(updatableTaxonomy, parent.name, true)
}

const loadConcept = async (updatableTaxonomy, conceptName) => {
  const concept = updatableTaxonomy[conceptName]
  if (!!concept) {
    return {}
  }

  const { concept: apiConcept, error: conceptError } = await getConcept(
    updatableTaxonomy,
    conceptName
  )
  if (!!conceptError) {
    return { error: conceptError }
  }

  updatableTaxonomy[conceptName] = fromApi(apiConcept)
  return {}
}

// Loads all concept children, skipping children already in taxonomy.
const loadChildren = async (
  updatableTaxonomy,
  conceptName,
  includeGrandChildren = true
) => {
  const concept = updatableTaxonomy[conceptName]
  if (!!concept.children) {
    return {}
  }

  const { error: childrenError, children } = await getChildren(
    updatableTaxonomy,
    conceptName
  )
  if (!!childrenError) {
    return { error: childrenError }
  }

  updatableTaxonomy[conceptName] = {
    ...concept,
    children: children.map(child => child.name),
  }

  const nonExtantChildren = children.filter(
    child => !updatableTaxonomy[child.name]
  )

  nonExtantChildren.forEach(child => {
    updatableTaxonomy[child.name] = { ...fromApi(child), parent: conceptName }
  })

  if (includeGrandChildren) {
    nonExtantChildren.forEach(async child => {
      await loadChildren(updatableTaxonomy, child.name, false)
    })
  }

  return {}
}

const loadParent = async (updatableTaxonomy, conceptName) => {
  if (conceptName === updatableTaxonomy._root_) {
    return {}
  }

  const concept = updatableTaxonomy[conceptName]
  if (!!concept.parent) {
    return {}
  }

  const { error: parentError, parent } = await getParent(
    updatableTaxonomy,
    conceptName
  )
  if (!!parentError) {
    return { error: parentError }
  }

  updatableTaxonomy[conceptName] = {
    ...concept,
    parent: parent.name,
  }

  if (!!updatableTaxonomy[parent.name]) {
    return {}
  }
  updatableTaxonomy[parent.name] = fromApi(parent)

  return {}
}

const loadRoot = async config => {
  const { error: rootError, root } = await getRoot(config)
  if (!!rootError) {
    return { error: rootError }
  }

  const { error: loadError, taxonomy: taxonomyWithRoot } = await load(
    { _config_: config, _root_: root.name },
    root.name
  )

  if (!!loadError) {
    return { error: loadError }
  }

  return { taxonomy: taxonomyWithRoot }
}

const needsUpdate = (taxonomy, conceptName, includeGrandChildren = false) => {
  const concept = taxonomy[conceptName]
  if (!concept || !concept.children || !concept.parent) {
    return true
  }

  if (includeGrandChildren) {
    return concept.children.reduce(
      (acc, child) => acc && !!taxonomy[child],
      true
    )
  }

  return false
}

export { load, loadRoot, needsUpdate }
