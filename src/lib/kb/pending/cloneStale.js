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
  freshConcept.aliases = (staleConcept.aliases || []).map(a => ({ ...a }))
  freshConcept.alternateNames = [...(staleConcept.alternateNames || [])]
  freshConcept.children = [...(staleConcept.children || [])]
  freshConcept.media = (staleConcept.media || []).map(m => ({ ...m }))
  freshConcept.linkRealizations = (staleConcept.linkRealizations || []).map(r => ({ ...r }))

  return freshConcept
}

export default cloneStale
