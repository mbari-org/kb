import { use, useMemo } from "react"

import { Box } from "@mui/material"

import FieldDeltaDetail from "./field/FieldDeltaDetail"
import FieldValueDetail from "./field/FieldValueDetail"
import MediaDetails from "./media/MediaDetails"

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
    const [field, { _initial, pending }] = edit
    switch (field) {
      case "media":
        return <MediaDetails key={field} edit={edit} />
      case "mediaIndex":
        return null
      case "nameUpdate":
        return <FieldValueDetail key={field} field={field} value={pending} />
      default:
        return <FieldDeltaDetail key={field} edit={edit} />
    }
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
