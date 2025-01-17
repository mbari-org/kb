import { Stack } from "@mui/material"

import ConceptAuthor from "./detail/ConceptAuthor"
import ConceptName from "./detail/ConceptName"
import ConceptRank from "./detail/ConceptRank"

import { RANK_LEVEL, RANK_LEVELS, RANK_NAME, RANK_NAMES } from "./detail/rank"

const ConceptDetail = () => {
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ flex: "1", ml: 1, mr: 1, textAlign: "left" }}
    >
      <ConceptName />
      <ConceptAuthor />
      <Stack direction="row" spacing={2}>
        <ConceptRank field={RANK_NAME} options={RANK_NAMES} />
        <ConceptRank field={RANK_LEVEL} options={RANK_LEVELS} />
      </Stack>
    </Stack>
  )
}

export default ConceptDetail
