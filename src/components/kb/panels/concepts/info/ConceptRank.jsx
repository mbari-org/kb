import { use } from "react"

import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"
import {
  REMOVAL_VALUE,
  rankLevelNameValue,
} from "@/contexts/concept/lib/validateUpdates"

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
    setConcept,
  } = use(ConceptContext)

  return (
    <FormControl {...infoStyle}>
      <InputLabel>Rank</InputLabel>
      <Select
        displayEmpty
        onChange={e => setConcept({ rankName: e.target.value })}
        value={rankLevelNameValue(rankName)}
      >
        {rankNames.map(rName => (
          <MenuItem key={rName} value={rName}>
            {rName}
          </MenuItem>
        ))}
        {rankName !== "" && (
          <MenuItem key={REMOVAL_VALUE} value={REMOVAL_VALUE}>
            {REMOVAL_VALUE}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}

export default ConceptRank
