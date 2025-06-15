import { use } from 'react'
import { Stack } from '@mui/material'

import ConceptRankField from '@/components/kb/panels/concepts/change/staged/concept/field/ConceptRankField'

import { RANK } from '@/lib/constants'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import useConceptDetailStyle from '@/components/kb/panels/concepts/change/staged/useConceptDetailStyle'

import { CONCEPT_STATE } from '@/lib/constants'

const ConceptRank = () => {
  const { initialState, modifyConcept, stagedState } = use(ConceptContext)

  const rankValue = field =>
    stagedState[field] !== undefined ? stagedState[field] : initialState[field]

  const rankLevelValue = rankValue(RANK.LEVEL)
  const rankNameValue = rankValue(RANK.NAME)

  const onChange = field => event => {
    modifyConcept({
      type: CONCEPT_STATE.FIELD.SET,
      update: { field, value: event.target.value },
    })
  }

  return (
    <Stack direction='row' spacing={1.5}>
      <ConceptRankField
        field={RANK.NAME}
        fieldValue={rankNameValue}
        otherValue={rankLevelValue}
        inputStyle={useConceptDetailStyle(RANK.NAME)}
        onChange={onChange(RANK.NAME)}
      />
      <ConceptRankField
        field={RANK.LEVEL}
        fieldValue={rankLevelValue}
        otherValue={rankNameValue}
        inputStyle={useConceptDetailStyle(RANK.LEVEL)}
        onChange={onChange(RANK.LEVEL)}
      />
    </Stack>
  )
}

export default ConceptRank
