import { use } from "react"

import { MenuItem, Select, FormControl, InputLabel } from "@mui/material"

import ConceptContext from "@/contexts/concept/ConceptContext"
import { REMOVE_RANK_VALUE } from "@/contexts/concept/lib/submit/validateUpdates"

import useConceptDetailStyle from "./useConceptDetailStyle"
import useWhyDidYouUpdate from "@/lib/hooks/useWhyDidYouUpdate"

const rankLevels = [
  "epi",
  "giga",
  "grand",
  "hyper",
  "infra",
  "parv",
  "sub",
  "super",
]

const ConceptLevel = () => {
  const {
    conceptState: { rankLevel },
    modifyConcept,
  } = use(ConceptContext)

  const infoStyle = useConceptDetailStyle("RankLevel")

  useWhyDidYouUpdate("ConceptLevel", { rankLevel })

  const rankLevelNameValue = value => (value !== REMOVE_RANK_VALUE ? value : "")

  return (
    <FormControl {...infoStyle}>
      <InputLabel>Level</InputLabel>
      <Select
        displayEmpty
        onChange={e => modifyConcept({ rankLevel: e.target.value })}
        value={rankLevelNameValue(rankLevel)}
      >
        {rankLevels.map(rLevel => (
          <MenuItem key={rLevel} value={rLevel}>
            {rLevel}
          </MenuItem>
        ))}
        {rankLevel !== "" && (
          <MenuItem key={REMOVE_RANK_VALUE} value={REMOVE_RANK_VALUE}>
            {REMOVE_RANK_VALUE}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}

export default ConceptLevel
