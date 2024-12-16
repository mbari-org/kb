import { use } from "react"

import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"
import {
  REMOVE_RANK_NAME_VALUE,
  rankLevelNameValue,
} from "@/contexts/concept/lib/validate/validateUpdates"

const rankNames = [
  "domain",
  "realm",
  "kingdom",
  "division",
  "phylum",
  "class",
  "order",
  "family",
  "tribe",
  "genus",
  "species",
  "variety",
  "form",
]

const ConceptRank = ({ infoStyle }) => {
  const {
    conceptState: { rankName },
    updateConcept,
  } = use(ConceptContext)

  return (
    <FormControl {...infoStyle}>
      <InputLabel>Rank</InputLabel>
      <Select
        displayEmpty
        onChange={e => updateConcept({ rankName: e.target.value })}
        value={rankLevelNameValue(rankName)}
      >
        {rankNames.map(rName => (
          <MenuItem key={rName} value={rName}>
            {rName}
          </MenuItem>
        ))}
        {rankName !== "" && (
          <MenuItem key={REMOVE_RANK_NAME_VALUE} value={REMOVE_RANK_NAME_VALUE}>
            {REMOVE_RANK_NAME_VALUE}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}

export default ConceptRank
