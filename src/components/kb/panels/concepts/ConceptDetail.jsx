import { Stack } from "@mui/material"

import ConceptAuthor from "./detail/ConceptAuthor"
import ConceptLevel from "./detail/ConceptLevel"
import ConceptName from "./detail/ConceptName"
import ConceptRank from "./detail/ConceptRank"

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
        <ConceptRank />
        <ConceptLevel />
      </Stack>
    </Stack>
  )
}

export default ConceptDetail
