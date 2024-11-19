import { use } from "react"

import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"

const taxonomyLevels = [
  "epi",
  "giga",
  "grand",
  "hyper",
  "infra",
  "parv",
  "sub",
  "super",
  "NONE",
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
        value={rankLevel !== "NONE" ? rankLevel : ""}
      >
        {taxonomyLevels.map(taxonomyLevel => (
          <MenuItem key={taxonomyLevel} value={taxonomyLevel}>
            {taxonomyLevel}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ConceptLevel
