import { Stack } from "@mui/material"

import ConceptAuthor from "./ConceptAuthor"
import ConceptLevel from "./ConceptLevel"
import ConceptName from "./ConceptName"
import ConceptRank from "./ConceptRank"

import useConceptInfoStyle from "./useConceptInfoStyle"

const ConceptInfo = ({ concept, editable }) => {
  const infoStyle = useConceptInfoStyle(editable)()

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ flex: "1", ml: 1, mr: 1, textAlign: "left" }}
    >
      <ConceptName concept={concept} />
      <ConceptAuthor concept={concept} infoStyle={infoStyle} />
      <Stack direction="row" spacing={2}>
        <ConceptRank concept={concept} infoStyle={infoStyle} />
        <ConceptLevel concept={concept} infoStyle={infoStyle} />
      </Stack>
    </Stack>
  )
}

export default ConceptInfo
