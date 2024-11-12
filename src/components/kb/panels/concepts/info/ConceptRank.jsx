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

const ConceptRank = ({ concept, infoStyle }) => {
  return (
    <FormControl {...infoStyle}>
      <InputLabel>Rank</InputLabel>
      <Select value={concept.rank} displayEmpty>
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
