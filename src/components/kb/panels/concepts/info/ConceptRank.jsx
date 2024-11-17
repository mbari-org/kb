import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

const ranks = [
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
