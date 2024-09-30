import getChildren from "@/lib/services/oni/concept/children"
import getConcept from "@/lib/services/oni/concept/concept"
import getParent from "@/lib/services/oni/concept/parent"

const expand = async (taxonomy, name) => {
  const concept = taxonomy[name]

  if (!concept) {
    return { error: `taxomomy does not have concept: ${name}` }
  }

  if (concept.children) {
    return { taxonomy }
  }

  try {
    const { children, error } = await getChildren(taxonomy._config, name)
    if (!!error) {
      return { error }
    }

    const names = children.map(child => child.name)

    const taxonomyWithChildren = children.reduce(
      (acc, child) => {
        acc[child.name] = child
        return acc
      },
      { ...taxonomy }
    )

    return {
      taxonomy: {
        ...taxonomyWithChildren,
        [name]: {
          ...concept,
          children: names,
        },
      },
    }
  } catch (error) {
    console.error(`Error expanding concept ${name}:`, error)
    return { taxonomy }
  }
}

const lineage = async (taxonomy, name) => {
  const { error: expandError, taxonomy: taxonomyWithName } = await expand(
    taxonomy,
    name
  )
  if (!!expandError) {
    return { error: expandError }
  }

  let currentTaxonomy = taxonomyWithName
  let conceptName = name

  while (conceptName !== "object") {
    const {
      error,
      parentName,
      taxonomy: taxonomyWithParent,
    } = await loadParent(currentTaxonomy, conceptName)

    if (!!error) {
      break
    }

    conceptName = parentName
    currentTaxonomy = taxonomyWithParent
  }

  return { taxonomy: currentTaxonomy }
}

const loadParent = async (taxonomy, name) => {
  const { error, parent } = await getParent(taxonomy._config, name)
  if (!!error) {
    return { error }
  }

  const parentName = parent.name

  return {
    parentName,
    taxonomy: {
      ...taxonomy,
      [parentName]: parent,
    },
  }
}

const load = async (taxonomy, name) => {
  const { concept, error } = await getConcept(taxonomy._config, name)
  if (!!error) {
    return { error }
  }

  return {
    taxonomy: {
      ...taxonomy,
      [name]: concept,
    },
  }
}

export { expand, lineage, load }
