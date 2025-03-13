import { use } from 'react'

import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material'

import AuthContext from '@/contexts/auth/AuthContext'
import ConceptContext from '@/contexts/concept/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useConceptDetailStyle from '@/components/kb/panels/concepts/detail/useConceptDetailStyle'
import ApprovalButton from '@/components/kb/panels/concepts/detail/ApprovalButton'

import { isAdmin } from '@/lib/auth/role'
import { hasPendingHistory } from '@/lib/kb/util/pendingHistory'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const ConceptRank = ({ field, otherValue }) => {
  const { user } = use(AuthContext)
  const { stagedState, editing, pendingHistory, modifyConcept } = use(ConceptContext)
  const { filterRanks } = use(TaxonomyContext)

  const rankOptions = filterRanks(field, otherValue)
  const fieldValue = stagedState[field]
  const label = field === 'rankName' ? 'Rank' : 'Level'

  const infoStyle = useConceptDetailStyle(field)

  const showApprovalButton = editing && isAdmin(user) && hasPendingHistory(pendingHistory, field)

  return (
    <FormControl {...infoStyle}>
      <Box display='flex' flexDirection='row' alignItems='center' width='100%'>
        <Box display='flex' flexDirection='column' flexGrow={1}>
          <InputLabel>{label}</InputLabel>
          <Select
            displayEmpty
            onChange={e =>
              modifyConcept({
                type: CONCEPT_STATE.FIELD.SET,
                update: { field, value: e.target.value },
              })
            }
            value={fieldValue}
          >
            {rankOptions.map(option => (
              <MenuItem key={option} sx={{ height: '1.75em' }} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {showApprovalButton && <ApprovalButton field={field} />}
      </Box>
    </FormControl>
  )
}

export default ConceptRank
