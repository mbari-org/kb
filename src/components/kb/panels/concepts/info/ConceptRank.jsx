import { use } from "react"

import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import ConceptEditContext from "@/contexts/concept/ConceptContext"

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
    conceptState: { rank },
    setConcept,
  } = use(ConceptEditContext)

  return (
    <FormControl {...infoStyle}>
      <InputLabel>Rank</InputLabel>
      <Select
        displayEmpty
        onChange={e => setConcept({ rank: e.target.value })}
        value={rank}
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
