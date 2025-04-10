import {
  fetchChildren,
  fetchConcept,
  fetchLinkRealizations,
  fetchNames,
  fetchParent,
} from '@/lib/services/api/oni/concept'

import { orderedAliases } from '@/lib/kb/concept/aliases'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

import { drop } from '@/lib/util'

const { MEDIA, NO_ACTION } = CONCEPT_STATE

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
const getNextSibling = (concept, getConcept) => {
  const parent = getConcept(concept.parent)
  if (concept && parent) {
    const siblings = parent.children
    const currentIndex = siblings.findIndex(sibling => sibling === concept.name)

    if (currentIndex !== -1 && currentIndex < siblings.length - 1) {
      return siblings[currentIndex + 1]
    }
  }
  return null
}

const getPrevSibling = (concept, getConcept) => {
  const parent = getConcept(concept.parent)
  if (concept && parent) {
    const siblings = parent.children
    const currentIndex = siblings.findIndex(sibling => sibling === concept.name)

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
  const [concept, names, linkRealizations] = await Promise.all([
    apiPayload(fetchConcept, conceptName),
    apiPayload(fetchNames, conceptName),
    apiPayload(fetchLinkRealizations, conceptName),
  ])
  concept.aliases = orderedAliases(names)
  concept.linkRealizations = linkRealizations
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

const refresh = async (concept, updateInfo, results, apiPayload) => {
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

  if (hasUpdated('media')) {
    updatedConcept.media = updatedValue('media').reduce((acc, mediaItem) => {
      switch (mediaItem.action) {
        case MEDIA.ADD: {
          const mediaId = results.find(result => result.url === mediaItem.url).id
          acc.push({ ...mediaItem, id: mediaId })
          break
        }
        case MEDIA.DELETE:
          break
        case MEDIA.EDIT:
        case NO_ACTION:
          acc.push(drop(mediaItem, ['action']))
          break
        default:
          break
      }
      return acc
    }, [])
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
