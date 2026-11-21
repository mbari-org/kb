import { getConceptByName } from '@/lib/api/concept'
import { sortConceptChildren } from '@/lib/model/concept'

export const cloneStale = async (apiFns, staleConcept, useServerBase = true) => {
  let base = {}
  if (useServerBase) {
    base = await apiFns.apiPayload(getConceptByName, staleConcept.name)
  }

  const freshConcept = { ...base }

  freshConcept.name = staleConcept.name
  freshConcept.parent = staleConcept.parent
  freshConcept.rankLevel = staleConcept.rankLevel
  freshConcept.rankName = staleConcept.rankName
  freshConcept.aliases = staleConcept.aliases.map(alias => ({ ...alias }))
  freshConcept.alternateNames = [...staleConcept.alternateNames]
  freshConcept.children = sortConceptChildren(staleConcept.children)
  freshConcept.media = staleConcept.media.map(media => ({ ...media }))
  freshConcept.templates = (staleConcept.templates || []).map(template => ({ ...template }))

  return freshConcept
}

export default cloneStale
