import { use, useMemo } from "react"

import { Box } from "@mui/material"

import EditDetail from "@/components/kb/panels/concepts/detail/editingState/edits/EditDetail"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { editsObject, format } from "./editingState"

const EditsDetail = () => {
  const { editingState, initialState } = use(ConceptContext)

  const edits = useMemo(
    () =>
      Object.entries(editsObject(initialState, editingState)).sort(
        ([keyA], [keyB]) => keyA.localeCompare(keyB)
      ),
    [initialState, editingState]
  )

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, ml: 2 }}>
      {edits.map(([field, { initial, pending }]) => (
        <EditDetail key={field} detail={format(field, initial, pending)} />
      ))}
    </Box>
  )
}

export default EditsDetail
