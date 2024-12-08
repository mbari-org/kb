import { use } from "react"

import { Stack } from "@mui/material"

import ConceptAuthor from "./detail/ConceptAuthor"
import ConceptLevel from "./detail/ConceptLevel"
import ConceptName from "./detail/ConceptName"
import ConceptRank from "./detail/ConceptRank"

import useConceptInfoStyle from "./detail/useConceptInfoStyle"

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
