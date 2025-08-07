import {
  getConcept as fetchConcept,
  getConceptChildren as fetchConceptChildren,
  getConceptNames as fetchConceptNames,
  getConceptParent as fetchConceptParent,
} from '@/lib/api/concept'
import { getConceptLinkRealizations as fetchConceptLinkRealizations } from '@/lib/api/linkRealizations'

import { orderedAliases } from '@/lib/kb/model/aliases'

const addedConcepts = (parent, updatesInfo) => {
  const { updatedValue } = updatesInfo
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

const refresh = async (conceptName, apiFns) => {
  const freshConcept = await loadConcept(conceptName, apiFns)
  const parent = await loadParent(conceptName, apiFns)
  freshConcept.parent = parent.name
  const children = await loadChildren(conceptName, apiFns)
  freshConcept.children = children.map(child => child.name)
  await loadConceptData(freshConcept, apiFns)

  return freshConcept
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
