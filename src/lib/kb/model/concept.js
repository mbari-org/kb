import {
  fetchConcept,
  fetchConceptChildren,
  fetchConceptLinkRealizations,
  fetchConceptNames,
  fetchConceptParent,
} from '@/lib/kb/api/concept'

import { orderedAliases } from '@/lib/kb/conceptState/aliases'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

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

  const aliases = await apiPayload(fetchConceptNames, concept.name)

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

const loadChildren = async (conceptName, apiPayload) => {
  const children = await apiPayload(fetchConceptChildren, conceptName)
  await Promise.all(
    children.map(async child => {
      child.parent = conceptName
      const names = await apiPayload(fetchConceptNames, child.name)
      child.aliases = orderedAliases(names)
    })
  )
  return children
}

const loadConcept = async (conceptName, apiPayload) => {
  const [concept, names, linkRealizations] = await Promise.all([
    apiPayload(fetchConcept, conceptName),
    apiPayload(fetchConceptNames, conceptName),
    apiPayload(fetchConceptLinkRealizations, conceptName),
  ])
  concept.aliases = orderedAliases(names)
  concept.linkRealizations = linkRealizations
  return concept
}

// const loadConceptData = async (conceptName, apiPayload) => {
//   const [annotations, linkRealizations] = await Promise.all([
//     apiPayload(fetchConceptAnnotations, conceptName),
//     apiPayload(fetchLinkRealizations, conceptName),
//   ])
//   return { annotations, linkRealizations }
// }

const loadParent = async (conceptName, apiPayload) => {
  const parent = await apiPayload(fetchConceptParent, conceptName)
  const aliases = await apiPayload(fetchConceptNames, parent.name)
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
    const rawNames = await apiPayload(fetchConceptNames, updatedConcept.name)
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
