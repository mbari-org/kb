import { use } from "react"

import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { REMOVE_RANK_VALUE } from "@/contexts/concept/lib/submit/validateUpdates"

import useConceptDetailStyle from "./useConceptDetailStyle"

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

const ConceptRank = () => {
  const {
    conceptState: { rankName },
    conceptUpdate,
  } = use(ConceptContext)

  const infoStyle = useConceptDetailStyle("RankName")

  const rankLevelNameValue = value => (value !== REMOVE_RANK_VALUE ? value : "")

  return (
    <FormControl {...infoStyle}>
      <InputLabel>Rank</InputLabel>
      <Select
        displayEmpty
        onChange={e => conceptUpdate({ rankName: e.target.value })}
        value={rankLevelNameValue(rankName)}
      >
        {rankNames.map(rName => (
          <MenuItem key={rName} value={rName}>
            {rName}
          </MenuItem>
        ))}
        {rankName !== "" && (
          <MenuItem key={REMOVE_RANK_VALUE} value={REMOVE_RANK_VALUE}>
            {REMOVE_RANK_VALUE}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}

export default ConceptRank
