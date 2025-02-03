import { Modal, Box, Button, IconButton, Stack } from "@mui/material"
import { IoClose } from "react-icons/io5"

import changeName from "../changeName/useChangeName"
import changeParent from "../changeParent/useChangeParent"

const ConceptStructureChoices = ({ onClose }) => {
  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          boxShadow: 3,
          left: "50%",
          minWidth: 200,
          p: 2,
          position: "absolute",
          top: "25%",
          transform: "translate(-50%, -25%)",
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

        <Stack spacing={1.5} mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={changeName({ onClose })}
          >
            Change Name
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={changeParent({ onClose })}
          >
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

export default ConceptStructureChoices
