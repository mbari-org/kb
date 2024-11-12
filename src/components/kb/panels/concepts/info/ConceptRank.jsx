import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

const ranks = [
  "species",
  "genus",
  "family",
  "order",
  "class",
  "phylum",
  "kingdom",
  "domain",
]

const ConceptRank = ({ concept, editable }) => {
  return (
    <FormControl fullWidth variant="filled" size="small">
      <InputLabel>Rank</InputLabel>
      <Select disabled={!editable} value={concept.rank || ""} displayEmpty>
        {ranks.map(rank => (
          <MenuItem key={rank} value={rank}>
            {rank}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ConceptRank
