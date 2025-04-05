import { use } from 'react'
import { Stack } from '@mui/material'

import ConceptAliases from './detail/ConceptAliases'
import ConceptAuthor from './detail/ConceptAuthor'
import ConceptMedia from './detail/ConceptMedia'
import ConceptName from './detail/ConceptName'
import ConceptRank from './detail/ConceptRank'

import AuthContext from '@/contexts/auth/AuthContext'
import ConceptContext from '@/contexts/concept/ConceptContext'

import useConceptDetailStyle from '@/components/kb/panels/concepts/detail/useConceptDetailStyle'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'
import { RANK } from '@/lib/kb/conceptState/rank'

import { isAdmin } from '@/lib/auth/role'
import { hasPendingHistory } from '@/lib/kb/util/pendingHistory'

const ConceptDetail = () => {
  const { user } = use(AuthContext)
  const { editing, initialState, modifyConcept, pendingHistory, stagedState } = use(ConceptContext)

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

  const showApprovalButton = field =>
    editing && isAdmin(user) && hasPendingHistory(pendingHistory, field)

  return (
    <Stack direction='row' spacing={1.5} sx={{ height: '100%' }}>
      <ConceptMedia />
      <Stack direction='column' spacing={2} sx={{ flex: '1', ml: 1, mr: 1, textAlign: 'left' }}>
        <ConceptName />
        <ConceptAuthor />
        <Stack direction='row' spacing={1}>
          <ConceptRank
            field={RANK.NAME}
            fieldValue={rankNameValue}
            otherValue={rankLevelValue}
            inputStyle={useConceptDetailStyle(RANK.NAME)}
            onChange={onChange(RANK.NAME)}
            showApprovalButton={showApprovalButton(RANK.NAME)}
          />
          <ConceptRank
            field={RANK.LEVEL}
            fieldValue={rankLevelValue}
            otherValue={rankNameValue}
            inputStyle={useConceptDetailStyle(RANK.LEVEL)}
            onChange={onChange(RANK.LEVEL)}
            showApprovalButton={showApprovalButton(RANK.LEVEL)}
          />
        </Stack>
        <ConceptAliases />
      </Stack>
    </Stack>
  )
}

export default ConceptDetail
