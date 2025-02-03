import { use } from "react"

import { Button, IconButton, Stack } from "@mui/material"

import { IoClose } from "react-icons/io5"

import EditNameActions from "../editName/EditNameActions"
import EditNameContent from "../editName/EditNameContent"
import EditNameTitle from "../editName/EditNameTitle"

import { createAlert } from "@/components/kb/factory"

import ModalContext from "@/contexts/modal/ModalContext"

const StructureEditChoices = ({ onClose }) => {
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
    <Stack
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        boxShadow: 3,
        left: "25%",
        minWidth: 200,
        p: 2,
        position: "absolute",
        top: "330%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          p: 0,
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <IoClose size={24} />
      </IconButton>

      <Stack spacing={1} mt={2}>
        <Button variant="contained" color="primary" onClick={editConceptName}>
          Change Name
        </Button>
        <Button variant="contained" color="primary">
          Change Parent
        </Button>
        <Button variant="contained" color="primary">
          Add Child
        </Button>
        <Button variant="contained" color="error">
          Delete Concept
        </Button>
      </Stack>
    </Stack>
  )
}

export default StructureEditChoices
