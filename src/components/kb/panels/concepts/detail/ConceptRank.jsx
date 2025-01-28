import { use } from "react"

import { Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import AuthContext from "@/contexts/auth/AuthContext"
import ConceptContext from "@/contexts/concept/ConceptContext"
import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import useConceptDetailStyle from "./useConceptDetailStyle"
import ApprovalButton from "./ApprovalButton"

import { isAdmin } from "@/lib/auth/role"
import { hasPendingHistory } from "@/lib/kb/util"

const RANK_REMOVE_VALUE = "REMOVE"

const ConceptRank = ({ field }) => {
  const { user } = use(AuthContext)
  const { editingState, editing, pendingHistory, modifyConcept } =
    use(ConceptContext)
  const { getRanks } = use(TaxonomyContext)
  const options = getRanks(field)

  // REMOVE_RANK_LEVEL is the Select option value, whereas the actual "removal" value is an empty string
  const rankValue = value => (value !== RANK_REMOVE_VALUE ? value : "")

  const fieldValue = editingState[field]
  const label = field === "rankName" ? "Rank" : "Level"

  const infoStyle = useConceptDetailStyle(field)

  const showApprovalButton =
    editing && isAdmin(user) && hasPendingHistory(pendingHistory, field)

  return (
    <FormControl {...infoStyle}>
      <Box display="flex" flexDirection="row" alignItems="center" width="100%">
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <InputLabel>{label}</InputLabel>
          <Select
            displayEmpty
            onChange={e =>
              modifyConcept({ [field]: rankValue(e.target.value) })
            }
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
        {showApprovalButton && <ApprovalButton field={field} />}
      </Box>
    </FormControl>
  )
}

export default ConceptRank
