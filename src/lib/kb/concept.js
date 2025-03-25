import { fetchConcept, fetchNames } from '@/lib/services/oni/api/concept'

import { orderedAliases } from '@/lib/kb/concept/aliases'

const addChild = (updatableConcept, updatableChild) => {
  updatableConcept.children.push(updatableChild)
  updatableChild.parent = updatableConcept
}

const getNextSibling = concept => {
  if (concept && concept.parent) {
    const siblings = concept.parent.children
    const currentIndex = siblings.findIndex(sibling => sibling.name === concept.name)

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
    const currentIndex = siblings.findIndex(sibling => sibling.name === concept.name)

    if (currentIndex > 0) {
      return siblings[currentIndex - 1]
    }
  }

  return null
}

const incompleteTaxonomy = concept => {
  return (
    !concept ||
    !concept.children ||
    concept.children.some(child => !child.children) ||
    !concept.parent
  )
}

const refresh = async (apiPayload, updatableTaxonomy, concept, updateInfo) => {
  const { hasUpdate, updateValue } = updateInfo

  const conceptName = hasUpdate('name') ? updateValue('name') : concept.name

  const updatableConcept = await apiPayload(fetchConcept, conceptName)
  updatableConcept.raw = false

  updatableConcept.children = concept.children.map(child => ({
    ...updatableTaxonomy.concepts[child.name],
  }))
  updatableConcept.parent = updatableTaxonomy.concepts[concept.parent.name]

  hasUpdate('aliases')
    ? refreshAliases(apiPayload, updatableConcept)
    : (updatableConcept.aliases = [...concept.aliases])

  return updatableConcept
}

const refreshAliases = async (apiPayload, updatableConcept) => {
  const rawNames = await apiPayload(fetchNames, updatableConcept.name)
  updatableConcept.aliases = orderedAliases(rawNames)
  updatableConcept.alternateNames = updatableConcept.aliases.map(alias => alias.name)
}

export { addChild, getNextSibling, getPrevSibling, incompleteTaxonomy, refresh }
