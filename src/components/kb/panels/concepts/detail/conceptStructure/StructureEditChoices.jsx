import { use } from "react"
import { Modal, Box, Button, IconButton, Stack } from "@mui/material"
import { IoClose } from "react-icons/io5"

import EditNameActions from "../editName/EditNameActions"
import EditNameContent from "../editName/EditNameContent"
import EditNameTitle from "../editName/EditNameTitle"

import { createModal } from "@/components/kb/factory"
import ModalContext from "@/contexts/modal/ModalContext"

const StructureEditChoices = ({ onClose }) => {
  const { setModal } = use(ModalContext)

  const editConceptName = () => {
    const modal = createModal({
      Actions: EditNameActions,
      Content: EditNameContent,
      Title: EditNameTitle,
    })
    onClose()
    setModal(modal)
  }

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "25%",
          transform: "translate(-50%, -25%)",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          boxShadow: 3,
          p: 2,
          minWidth: 200,
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
      </Box>
    </Modal>
  )
}

export default StructureEditChoices
