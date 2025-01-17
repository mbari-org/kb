import { use } from "react"

import { Stack } from "@mui/material"

import ConceptActionButtons from "./detail/ConceptActionButtons"
import ConceptDetail from "./ConceptDetail"
import ConceptMedia from "./media/ConceptMedia"
import ConceptPath from "./ConceptPath"
import ConceptViewToggle from "./toggleView/ConceptViewToggle"

import { isReadOnly } from "@/lib/auth/role"

import AuthContext from "@/contexts/auth/AuthContext"
import ConceptContext from "@/contexts/concept/ConceptContext"

const Concept = () => {
  const { user } = use(AuthContext)
  const { editingState } = use(ConceptContext)

  if (editingState && Object.keys(editingState).length === 0) {
    return null
  }

  return (
    <Stack
      direction="column"
      spacing={1.5}
      sx={{
        m: 2,
        mt: 1,
        minHeight: "100vh",
        position: "relative",
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
      {!isReadOnly(user) && <ConceptActionButtons />}
    </Stack>
  )
}

export default Concept
