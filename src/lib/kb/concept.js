import {
  fetchChildren,
  fetchConcept,
  fetchNames,
  fetchParent,
} from '@/lib/services/oni/api/concept'

import { orderedAliases } from '@/lib/kb/concept/aliases'

const addedConcepts = (parent, updateInfo) => {
  const { updatedValue } = updateInfo
  return updatedValue('children').map(child => ({
    ...child,
    aliases: [],
    alternateNames: [],
    linkRealizations: [],
    media: [],
    parent,
    references: [],
  }))
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

// CxInc
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

const loadConcept = async (conceptName, apiPayload) => {
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

const loadParent = async (conceptName, apiPayload) => {
  const parent = await apiPayload(fetchParent, conceptName)
  const aliases = await apiPayload(fetchNames, parent.name)
  parent.aliases = orderedAliases(aliases)
  return parent
}

const refresh = async (concept, updateInfo, apiPayload) => {
  const { hasUpdated, updatedValue } = updateInfo

  const updatedConcept = { ...concept }

  for (const field of ['author', 'rankLevel', 'rankName', 'name', 'parent']) {
    if (hasUpdated(field)) {
      updatedConcept[field] = updatedValue(field)
    }
  }

  if (hasUpdated('aliases')) {
    const rawNames = await apiPayload(fetchNames, updatedConcept.name)
    updatedConcept.aliases = orderedAliases(rawNames)
    updatedConcept.alternateNames = updatedConcept.aliases.map(alias => alias.name)
  }

  if (hasUpdated('children')) {
    updatedConcept.children = [
      ...concept.children,
      ...updatedValue('children').map(child => child.name),
    ].sort()
  }

  return updatedConcept
}

export {
  addedConcepts,
  complete,
  getNextSibling,
  getPrevSibling,
  incompleteConcept,
  loadChildren,
  loadConcept,
  loadParent,
  refresh,
}
