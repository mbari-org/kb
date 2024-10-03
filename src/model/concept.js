import getChildren from "@/lib/services/oni/concept/children"
import getConcept from "@/lib/services/oni/concept/concept"
import getParent from "@/lib/services/oni/concept/parent"

// nullify Concept arrays (which are all [] from the API). This allows taxonomy introspection
// to "know" if the concept has already been filled (which requires separate API calls).
const fromApi = concept => ({
  ...concept,
  linkRealizations: null,
  media: null,
  references: null,
})

// Loads the lineage of the specified concept. Should only be called on initial startup, and will
// add the specified concept and it's children, then walk the up taxonomy to 'object', adding
// each parent and it's children.
const lineage = async (taxonomy, conceptName) => {
  const { error: conceptError, taxonomy: taxonomyWithChildren } = await load(
    taxonomy,
    conceptName
  )
  if (!!conceptError) {
    return { error: conceptError, taxonomy }
  }

  let updatedTaxonomy = taxonomyWithChildren
  let currentName = conceptName
  let lineageError

  while (currentName !== "object") {
    const {
      error: parentError,
      parentName,
      taxonomy: taxonomyWithParent,
    } = await loadParent(updatedTaxonomy, currentName)

    if (!!parentError) {
      lineageError = parentError
      break
    }

    // CxNote during lineage we are moving up the taxonomy tree so we specified the currentName
    // when loading children to prevent overwriting the a child concept we already know about.
    const { error: childrenError, taxonomy: taxonomyWithParentChildren } =
      await loadChildren(taxonomyWithParent, parentName, currentName)
    if (!!childrenError) {
      lineageError = childrenError
      break
    }
    currentName = parentName
    updatedTaxonomy = taxonomyWithParentChildren
  }

  return { error: lineageError, taxonomy: updatedTaxonomy }
}

// Loads the specifed concept and all it's children
const load = async (taxonomy, conceptName) => {
  let concept = taxonomy[conceptName]
  let updatedTaxonomy = taxonomy

  if (!concept) {
    const { concept: apiConcept, error: conceptError } = await getConcept(
      taxonomy,
      conceptName
    )
    if (!!conceptError) {
      return { error: conceptError, taxonomy }
    }
    concept = fromApi(apiConcept)
    updatedTaxonomy = {
      ...taxonomy,
      [conceptName]: concept,
    }
  }

  if (!concept.children) {
    const { error: childrenError, taxonomy: taxonomyWithChildren } =
      await loadChildren(updatedTaxonomy, conceptName)

    if (!!childrenError) {
      return {
        error: childrenError,
        updatedTaxonomy,
      }
    }
    updatedTaxonomy = taxonomyWithChildren
  }

  return {
    taxonomy: updatedTaxonomy,
  }
}

// Loads all the children of a parent. If a known child name is specified, that child is skipped
// to prevent overwriting previously obtained data.
const loadChildren = async (taxonomy, parentName, knownChildName) => {
  const { error: conceptError, concept } = taxonomyConcept(taxonomy, parentName)
  if (!!conceptError) {
    return { error: conceptError, taxonomy }
  }

  const { error: childrenError, children } = await getChildren(
    taxonomy,
    parentName
  )
  if (!!childrenError) {
    return { error: childrenError, taxonomy }
  }

  const taxonomyWithChildren = children
    .filter(child => child.name !== knownChildName)
    .reduce(
      (acc, child) => {
        acc[child.name] = { ...fromApi(child), parent: parentName }
        return acc
      },
      { ...taxonomy }
    )

  return {
    taxonomy: {
      ...taxonomyWithChildren,
      [parentName]: {
        ...concept,
        children: children.map(child => child.name),
      },
    },
  }
}

// Loads the concept parent and assigns the parent to the concept
const loadParent = async (taxonomy, conceptName) => {
  if (conceptName === "object") {
    return {
      parentName: null,
      taxonomy,
    }
  }

  const { error: conceptError, concept } = taxonomyConcept(
    taxonomy,
    conceptName
  )
  if (!!conceptError) {
    return { error: conceptError, taxonomy }
  }

  const { error: parentError, parent } = await getParent(taxonomy, conceptName)
  if (!!parentError) {
    return { error: parentError, taxonomy }
  }

  const parentName = parent.name

  return {
    parentName,
    taxonomy: {
      ...taxonomy,
      [parentName]: fromApi(parent),
      [conceptName]: {
        ...concept,
        parent: parentName,
      },
    },
  }
}

const taxonomyConcept = (taxonomy, conceptName) => {
  const concept = taxonomy[conceptName]
  if (!concept) {
    return { error: `Taxonomy does not have concept: ${conceptName}` }
  }
  return { concept }
}

export { fromApi, lineage, load }
