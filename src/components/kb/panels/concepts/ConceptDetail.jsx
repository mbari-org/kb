import { use } from "react"
import { Stack } from "@mui/material"

import ConceptAuthor from "./detail/ConceptAuthor"
import ConceptName from "./detail/ConceptName"
import ConceptRank from "./detail/ConceptRank"

import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"

import { RANK } from "@/lib/kb/taxonomy"

const ConceptDetail = () => {
  const { getRanks } = use(TaxonomyContext)

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ flex: "1", ml: 1, mr: 1, textAlign: "left" }}
    >
      <ConceptName />
      <ConceptAuthor />
      <Stack direction="row" spacing={2}>
        <ConceptRank field={RANK.LEVEL} options={getRanks(RANK.LEVEL)} />
        <ConceptRank field={RANK.NAME} options={getRanks(RANK.NAME)} />
      </Stack>
    </Stack>
  )
}

export default ConceptDetail
