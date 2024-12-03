import { use } from "react"

import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"
import {
  REMOVAL_VALUE,
  rankLevelNameValue,
} from "@/contexts/concept/validateUpdates"

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
    setConcept,
  } = use(ConceptContext)

  return (
    <FormControl {...infoStyle}>
      <InputLabel>Level</InputLabel>
      <Select
        displayEmpty
        onChange={e => setConcept({ rankLevel: e.target.value })}
        value={rankLevelNameValue(rankLevel)}
      >
        {rankLevels.map(rLevel => (
          <MenuItem key={rLevel} value={rLevel}>
            {rLevel}
          </MenuItem>
        ))}
        {rankLevel !== "" && (
          <MenuItem key={REMOVAL_VALUE} value={REMOVAL_VALUE}>
            {REMOVAL_VALUE}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}

export default ConceptLevel
