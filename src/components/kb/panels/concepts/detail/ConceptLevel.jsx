import { use } from "react"

import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"
import {
  REMOVE_RANK_NAME_VALUE,
  rankLevelNameValue,
} from "@/contexts/concept/lib/validate/validateDetailUpdates"

const rankLevels = [
  "epi",
  "giga",
  "grand",
  "hyper",
  "infra",
  "parv",
  "sub",
  "super",
]

const ConceptLevel = ({ infoStyle }) => {
  const {
    conceptState: { rankLevel },
    conceptUpdate,
  } = use(ConceptContext)

  return (
    <FormControl {...infoStyle}>
      <InputLabel>Level</InputLabel>
      <Select
        displayEmpty
        onChange={e => conceptUpdate({ rankLevel: e.target.value })}
        value={rankLevelNameValue(rankLevel)}
      >
        {rankLevels.map(rLevel => (
          <MenuItem key={rLevel} value={rLevel}>
            {rLevel}
          </MenuItem>
        ))}
        {rankLevel !== "" && (
          <MenuItem key={REMOVE_RANK_NAME_VALUE} value={REMOVE_RANK_NAME_VALUE}>
            {REMOVE_RANK_NAME_VALUE}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}

export default ConceptLevel
