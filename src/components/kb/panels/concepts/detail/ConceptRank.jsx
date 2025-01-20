import { use } from "react"

import { Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import AuthContext from "@/contexts/auth/AuthContext"
import ConceptContext from "@/contexts/concept/ConceptContext"
import {
  RANK_REMOVE_VALUE,
  rankValue,
} from "@/contexts/concept/lib/submit/validateUpdates"

import useConceptDetailStyle from "./useConceptDetailStyle"
import ConceptPendingHistoryButton from "./ConceptPendingHistoryButton"

import { isAdmin } from "@/lib/auth/role"
import { hasPendingHistory } from "@/lib/kb/util"

const ConceptRank = ({ field, options }) => {
  const { user } = use(AuthContext)
  const { editingState, editing, pendingHistory, modifyConcept } =
    use(ConceptContext)

  const fieldValue = editingState[field]

  const infoStyle = useConceptDetailStyle(field)
  const fieldHasPendingHistory = hasPendingHistory(pendingHistory, field)

  const label = field === "rankName" ? "Rank" : "Level"

  return (
    <FormControl {...infoStyle}>
      <Box display="flex" flexDirection="row" alignItems="center" width="100%">
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <InputLabel>{label}</InputLabel>
          <Select
            displayEmpty
            onChange={e => modifyConcept({ [field]: e.target.value })}
            value={rankValue(fieldValue)}
          >
            {options.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
            {fieldValue !== "" && (
              <MenuItem key={RANK_REMOVE_VALUE} value={RANK_REMOVE_VALUE}>
                {RANK_REMOVE_VALUE}
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
