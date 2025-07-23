import { use } from 'react'
import { Stack } from '@mui/material'

import RankFieldInput from '@/components/kb/panels/concepts/concept/change/staged/rank/RankFieldInput'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_RANK, CONCEPT_STATE } from '@/lib/constants'

const ConceptRank = () => {
  const { initialState, modifyConcept, stagedState } = use(ConceptContext)

  const initialRank = initialState.rank
  const stagedRank = stagedState.rank

  const onChange = field => event => {
    modifyConcept({
      type: CONCEPT_STATE.RANK,
      update: {
        field,
        value: event.target.value,
      },
    })
  }

  return (
    <Stack direction='row' spacing={1.5}>
      <RankFieldInput
        field={CONCEPT_RANK.NAME}
        initialRank={initialRank}
        stagedRank={stagedRank}
        onChange={onChange(CONCEPT_RANK.NAME)}
      />
      <RankFieldInput
        field={CONCEPT_RANK.LEVEL}
        initialRank={initialRank}
        stagedRank={stagedRank}
        onChange={onChange(CONCEPT_RANK.LEVEL)}
      />
    </Stack>
  )
}

export default ConceptRank
