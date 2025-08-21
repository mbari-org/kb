import { getConcept } from '@/lib/api/concept'

export const cloneStale = async (apiFns, staleConcept, useServerBase = true) => {
  let base = {}
  if (useServerBase) {
    base = await apiFns.apiPayload(getConcept, staleConcept.name)
  }

  const freshConcept = { ...base }

  freshConcept.name = staleConcept.name
  freshConcept.parent = staleConcept.parent
  freshConcept.rankLevel = staleConcept.rankLevel
  freshConcept.rankName = staleConcept.rankName
  freshConcept.aliases = staleConcept.aliases.map(alias => ({ ...alias }))
  freshConcept.alternateNames = [...staleConcept.alternateNames]
  freshConcept.children = [...staleConcept.children]
  freshConcept.media = staleConcept.media.map(media => ({ ...media }))
  freshConcept.realizations = staleConcept.realizations.map(realization => ({ ...realization }))

  return freshConcept
}

export default cloneStale
