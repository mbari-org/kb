import { use, useMemo } from "react"

import { Box } from "@mui/material"

import FieldDetail from "./FieldDetail"
import MediaDetails from "./MediaDetails"

import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"

import { editsObject } from "./editingState"

const EditDetails = () => {
  const { editingState, initialState } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  const edits = useMemo(
    () =>
      Object.entries(editsObject(initialState, editingState)).sort(
        ([keyA], [keyB]) => keyA.localeCompare(keyB)
      ),
    [initialState, editingState]
  )

  const editComponent = edit => {
    const [field, _] = edit
    if (field === "media") {
      return <MediaDetails key={field} edit={edit} />
    }

    return <FieldDetail key={field} edit={edit} />
  }

  if (edits.length === 0) {
    setModal(null)
    return null
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {edits.map(editComponent)}
    </Box>
  )
}

export default EditDetails
