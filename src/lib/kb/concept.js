import { fetchChildren, fetchConcept, fetchNames } from '@/lib/services/oni/api/concept'

import { orderedAliases } from '@/lib/kb/concept/aliases'

const addChild = (updatableConcept, updatableChild) => {
  updatableConcept.children.push(updatableChild)
  updatableChild.parent = updatableConcept
}

const complete = async (concept, apiPayload) => {
  if (!incompleteConcept(concept)) {
    return { concept, wasComplete: true }
  }

  const aliases = await apiPayload(fetchNames, concept.name)

  const updatedConcept = { ...concept }
  updatedConcept.aliases = orderedAliases(aliases)
  return { concept: updatedConcept, wasComplete: false }
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

const incompleteConcept = concept => {
  return (
    !concept ||
    !concept.children ||
    concept.children.some(child => !child.children) ||
    !concept.parent
  )
}

const load = async (conceptName, apiPayload) => {
  const [concept, names] = await Promise.all([
    apiPayload(fetchConcept, conceptName),
    apiPayload(fetchNames, conceptName),
  ])

  concept.aliases = orderedAliases(names)

  return concept
}

const loadChildren = async (conceptName, apiPayload) => {
  const children = await apiPayload(fetchChildren, conceptName)
  await Promise.all(
    children.map(async child => {
      child.parent = conceptName
      const names = await apiPayload(fetchNames, child.name)
      child.aliases = orderedAliases(names)
    })
  )
  return children
}

const loadParent = async (concept, apiPayload) => {
  // CxDelete ?????
  const parent = await load(concept.parent, apiPayload)

  parent.children = await loadChildren(parent, apiPayload)
  return parent
}

const refresh = async (concept, updateInfo, apiPayload) => {
  const { hasUpdated, updateValue } = updateInfo

  const conceptName = hasUpdated('name') ? updateValue('name') : concept.name

  const updatableConcept = await apiPayload(fetchConcept, conceptName)

  hasUpdated('aliases')
    ? refreshAliases(apiPayload, updatableConcept)
    : (updatableConcept.aliases = [...concept.aliases])

  return updatableConcept
}

const refreshAliases = async (apiPayload, updatableConcept) => {
  const rawNames = await apiPayload(fetchNames, updatableConcept.name)
  updatableConcept.aliases = orderedAliases(rawNames)
  updatableConcept.alternateNames = updatableConcept.aliases.map(alias => alias.name)
}

export {
  addChild,
  complete,
  getNextSibling,
  getPrevSibling,
  incompleteConcept,
  load,
  loadChildren,
  loadParent,
  refresh,
}
