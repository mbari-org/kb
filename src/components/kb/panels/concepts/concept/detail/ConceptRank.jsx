import { use, useCallback } from 'react'
import { Stack } from '@mui/material'

import RankFieldInput from '@/components/kb/panels/concepts/concept/change/staged/rank/RankFieldInput'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { pendingChange } from '@/lib/kb/state/rank'

import { CONCEPT_RANK, CONCEPT_STATE, PENDING } from '@/lib/constants'

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
        field={CONCEPT_RANK.NAME}
        initialRank={initialRank}
        rank={stagedField(CONCEPT_RANK.NAME)}
        onChange={onChange(CONCEPT_RANK.NAME)}
      />
      <RankFieldInput
        field={CONCEPT_RANK.LEVEL}
        initialRank={initialRank}
        rank={stagedField(CONCEPT_RANK.LEVEL)}
        onChange={onChange(CONCEPT_RANK.LEVEL)}
      />
    </Stack>
  )
}

export default ConceptRank
