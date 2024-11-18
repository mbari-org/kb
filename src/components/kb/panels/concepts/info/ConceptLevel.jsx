import { use } from "react"

import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import ConceptEditContext from "@/contexts/concept/ConceptContext"

const taxonomyLevels = [
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
    conceptState: { level },
    setConcept,
  } = use(ConceptEditContext)

  return (
    <FormControl {...infoStyle}>
      <InputLabel>Level</InputLabel>
      <Select
        displayEmpty
        onChange={e => setConcept({ level: e.target.value })}
        value={level}
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
