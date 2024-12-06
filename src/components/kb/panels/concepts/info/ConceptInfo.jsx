import { use } from "react"

import { Stack } from "@mui/material"

import ConceptAuthor from "./ConceptAuthor"
import ConceptLevel from "./ConceptLevel"
import ConceptName from "./ConceptName"
import ConceptRank from "./ConceptRank"

import useConceptInfoStyle from "./useConceptInfoStyle"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptInfo = () => {
  const { editing } = use(ConceptContext)

  const infoStyle = useConceptInfoStyle(editing)()

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ flex: "1", ml: 1, mr: 1, textAlign: "left" }}
    >
      <ConceptName />
      <ConceptAuthor infoStyle={infoStyle} />
      <Stack direction="row" spacing={2}>
        <ConceptRank infoStyle={infoStyle} />
        <ConceptLevel infoStyle={infoStyle} />
      </Stack>
    </Stack>
  )
}

export default ConceptInfo
