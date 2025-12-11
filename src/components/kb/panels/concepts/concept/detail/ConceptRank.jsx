import { use, useCallback } from 'react'
import { Stack } from '@mui/material'

import RankFieldInput from '@/components/kb/panels/concepts/concept/change/staged/rank/RankFieldInput'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { pendingChange } from '@/lib/concept/state/rank'
import CONFIG from '@/text'
import { PENDING } from '@/lib/constants/pending.js'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const ConceptRank = () => {
  const { initialState, modifyConcept, pending, stagedState } = use(ConceptContext)

  const initialRank = initialState.rank
  const stagedRank = stagedState.rank

  const onChange = field => event => {
    const value = event.target.value
    const action = value === initialState.rank[field] ? CONCEPT_STATE.NO_ACTION : CONCEPT_STATE.RANK
    modifyConcept({
      type: action,
      update: {
        action,
        [field]: value,
      },
    })
  }

  // Since rank is a composite field of concept state, mimic individual pending rank changes
  const stagedField = useCallback(
    field => {
      const pendingConcept = pending(PENDING.DATA.CONCEPT)
      const pendingRankChange = pendingChange(pendingConcept)

      if (pendingRankChange) {
        if (pendingRankChange.new[field] === pendingRankChange.old[field]) {
          return {
            ...stagedRank,
            action: CONCEPT_STATE.NO_ACTION,
            historyId: undefined,
          }
        }
        return stagedRank
      }

      if (stagedRank[field] === initialRank[field]) {
        return {
          ...stagedRank,
          action: CONCEPT_STATE.NO_ACTION,
        }
      }

      return stagedRank
    },
    [initialRank, pending, stagedRank]
  )

  return (
    <Stack direction='row' spacing={1.5}>
      <RankFieldInput
        field={CONCEPT.RANK.NAME}
        initialRank={initialRank}
        label={CONFIG.PANELS.CONCEPTS.RANK.NAME}
        rank={stagedField(CONCEPT.RANK.NAME)}
        onChange={onChange(CONCEPT.RANK.NAME)}
      />
      <RankFieldInput
        field={CONCEPT.RANK.LEVEL}
        initialRank={initialRank}
        label={CONFIG.PANELS.CONCEPTS.RANK.LEVEL}
        rank={stagedField(CONCEPT.RANK.LEVEL)}
        onChange={onChange(CONCEPT.RANK.LEVEL)}
      />
    </Stack>
  )
}

export default ConceptRank
