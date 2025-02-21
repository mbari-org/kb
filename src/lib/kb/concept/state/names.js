import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'
const namesState = concept => {
  const { names: conceptNames } = concept
  if (!conceptNames) {
    return []
  }

  const names = conceptNames.map(alias => ({
    ...alias,
    action: CONCEPT_STATE.NO_ACTION,
  }))

  return {
    names,
    namesIndex: 0,
  }
}

export { namesState }
