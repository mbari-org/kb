import { use } from "react"

import { Stack } from "@mui/material"

import ConceptActionButtons from "./detail/ConceptActionButtons"
import ConceptDetail from "./ConceptDetail"
import ConceptMedia from "./media/ConceptMedia"
import ConceptPath from "./ConceptPath"
import ConceptViewToggle from "./toggleView/ConceptViewToggle"

import ConceptContext from "@/contexts/concept/ConceptContext"

const Concept = () => {
  const { conceptState } = use(ConceptContext)

  if (conceptState && Object.keys(conceptState).length === 0) {
    return null
  }

  return (
    <Stack
      direction="column"
      spacing={1.5}
      sx={{
        minHeight: "100vh",
        position: "relative",
        m: 1,
        mr: 2,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <ConceptPath />
        <ConceptViewToggle />
      </Stack>
      <Stack direction="row" spacing={1.5}>
        <ConceptMedia />
        <ConceptDetail />
      </Stack>
      <ConceptActionButtons />
    </Stack>
  )
}

export default Concept
