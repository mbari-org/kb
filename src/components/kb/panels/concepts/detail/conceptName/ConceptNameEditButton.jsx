import { use } from "react"
import { CiEdit } from "react-icons/ci"
import { IconButton } from "@mui/material"
import ConceptContext from "@/contexts/concept/ConceptContext"
import ModalContext from "@/contexts/modal/ModalContext"
import { createAlert } from "@/components/kb/factory"
import EditNameActions from "../editName/EditNameActions"
import EditNameContent from "../editName/EditNameContent"
import EditNameTitle from "../editName/EditNameTitle"

const ConceptNameEditButton = () => {
  const { editing } = use(ConceptContext)
  const { setAlert } = use(ModalContext)

  const editConceptName = () => {
    const alert = createAlert({
      Actions: EditNameActions,
      Content: EditNameContent,
      Title: EditNameTitle,
    })
    setAlert(alert)
  }

  return (
    <IconButton
      aria-label="Edit concept name"
      color="main"
      disabled={editing}
      onClick={editConceptName}
      sx={{
        mb: 2,
        ml: 0.5,
        padding: 0,
        visibility: editing ? "hidden" : "visible",
        "&:hover": {
          backgroundColor: `transparent !important`,
          transform: "scale(1.25)",
        },
      }}
    >
      <CiEdit size={24} />
    </IconButton>
  )
}

export default ConceptNameEditButton
