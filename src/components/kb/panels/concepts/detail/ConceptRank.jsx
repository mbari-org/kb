import { use } from "react"

import { Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import AuthContext from "@/contexts/auth/AuthContext"
import ConceptContext from "@/contexts/concept/ConceptContext"
import { REMOVE_RANK_VALUE } from "@/contexts/concept/lib/submit/validateUpdates"

import useConceptDetailStyle from "./useConceptDetailStyle"
import ConceptPendingHistoryButton from "./ConceptPendingHistoryButton"

import { isAdmin } from "@/lib/auth/role"
import { hasPendingHistory } from "@/lib/kb/util"

const ConceptRank = ({ field, options }) => {
  const { user } = use(AuthContext)
  const { editingState, editing, pendingHistory, modifyConcept } =
    use(ConceptContext)

  const rankValue = editingState[field]

  const infoStyle = useConceptDetailStyle(field)
  const fieldHasPendingHistory = hasPendingHistory(pendingHistory, field)

  // REMOVE_RANK_LEVEL is the displayed value, whereas the "removal" value is an empty string
  const rankLevelNameValue = value => (value !== REMOVE_RANK_VALUE ? value : "")

  return (
    <FormControl {...infoStyle}>
      <Box display="flex" flexDirection="row" alignItems="center" width="100%">
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <InputLabel>Level</InputLabel>
          <Select
            displayEmpty
            onChange={e => modifyConcept({ [field]: e.target.value })}
            value={rankLevelNameValue(rankValue)}
          >
            {options.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
            {rankValue !== "" && (
              <MenuItem key={REMOVE_RANK_VALUE} value={REMOVE_RANK_VALUE}>
                {REMOVE_RANK_VALUE}
              </MenuItem>
            )}
          </Select>
        </Box>
        {editing && fieldHasPendingHistory && isAdmin(user) && (
          <ConceptPendingHistoryButton field={field} />
        )}
      </Box>
    </FormControl>
  )
}

export default ConceptRank
