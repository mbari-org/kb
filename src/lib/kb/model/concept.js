import {
  getConcept as fetchConcept,
  getConceptChildren as fetchConceptChildren,
  getConceptNames as fetchConceptNames,
  getConceptParent as fetchConceptParent,
} from '@/lib/api/concept'
import { getConceptLinkRealizations as fetchConceptLinkRealizations } from '@/lib/api/linkRealizations'

import { CONCEPT_STATE } from '@/lib/constants'
import { orderedAliases } from '@/lib/kb/model/aliases'

import { isStagedAction } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { drop } from '@/lib/utils'

const { MEDIA_ITEM: MEDIA } = CONCEPT_STATE

const addedConcepts = (parent, updateInfo) => {
  const { updatedValue } = updateInfo
  return updatedValue('children').map(child => ({
    ...child,
    aliases: [],
    alternateNames: [],
    realizations: [],
    media: [],
    parent,
    references: [],
  }))
}

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

const loadChildren = async (conceptName, apiFns) => {
  const children = await apiFns.apiPayload(fetchConceptChildren, conceptName)
  await Promise.all(
    children.map(async child => {
      child.parent = conceptName
    })
  )
  return children
}

const loadConcept = async (conceptName, apiFns) => {
  const { error, payload: concept } = await apiFns.apiRaw(fetchConcept, conceptName)
  if (error) throw error

  await loadConceptData(concept, apiFns)

  return concept
}

const loadConceptData = async (concept, apiFns) => {
  const [aliases, realizations] = await Promise.all([
    apiFns.apiPayload(fetchConceptNames, concept.name),
    apiFns.apiPayload(fetchConceptLinkRealizations, concept.name),
  ])
  concept.aliases = orderedAliases(aliases)
  concept.realizations = realizations || []
  return concept
}

const loadParent = async (conceptName, apiFns) => apiFns.apiPayload(fetchConceptParent, conceptName)

const refresh = async (concept, updateInfo, apiFns) => {
  const { hasUpdated, results, updatedValue } = updateInfo

  const updatedConcept = { ...concept }

  for (const field of ['author', 'rankLevel', 'rankName', 'name', 'parent']) {
    if (hasUpdated(field)) {
      updatedConcept[field] = updatedValue(field)
    }
  }

  if (hasUpdated('aliases')) {
    const rawNames = await apiFns.apiPayload(fetchConceptNames, updatedConcept.name)
    updatedConcept.aliases = orderedAliases(rawNames)
    updatedConcept.alternateNames = updatedConcept.aliases.map(alias => alias.name)
  }

  if (hasUpdated('realizations')) {
    const rawRealizations = await apiFns.apiPayload(
      fetchConceptLinkRealizations,
      updatedConcept.name
    )
    updatedConcept.realizations = rawRealizations || []
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
          acc.push(drop(mediaItem, ['action']))
          break

        default:
          if (isStagedAction(mediaItem.action)) {
            acc.push(drop(mediaItem, ['action']))
          }
          break
      }
      return acc
    }, [])
  }

  return updatedConcept
}

export {
  addedConcepts,
  getNextSibling,
  getPrevSibling,
  loadChildren,
  loadConcept,
  loadConceptData,
  loadParent,
  refresh,
}
