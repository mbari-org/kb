import { use } from "react"

import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"

const taxonomyRanks = [
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
        value={rankName}
      >
        {taxonomyRanks.map(taxonomyRank => (
          <MenuItem key={taxonomyRank} value={taxonomyRank}>
            {taxonomyRank}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ConceptRank
