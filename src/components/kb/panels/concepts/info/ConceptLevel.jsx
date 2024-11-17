import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

const levels = [
  "epi",
  "giga",
  "grand",
  "hyper",
  "infra",
  "parv",
  "sub",
  "super",
]

const ConceptLevel = ({ concept, infoStyle }) => {
  return (
    <FormControl {...infoStyle}>
      <InputLabel>Level</InputLabel>
      <Select value={concept.level || ""} displayEmpty>
        {levels.map(level => (
          <MenuItem key={level} value={level}>
            {level}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ConceptLevel
