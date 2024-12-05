import { use } from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import ConceptEditContext from "@/contexts/conceptEdit/ConceptEditContext"

const ConceptActionButtons = () => {
  const { editable, isModified, saveChanges, setEditable } =
    use(ConceptEditContext)

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 60,
        left: 10,
        right: 20,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Button
        color={editable ? "cancel" : "main"}
        onClick={() => (editable ? saveChanges(false) : setEditable(true))}
        variant="contained"
      >
        {editable ? "Cancel" : "Edit"}
      </Button>
      <Button
        disabled={!editable || !isModified}
        onClick={() => saveChanges(true)}
        variant="contained"
      >
        Save
      </Button>
    </Box>
  )
}

export default ConceptActionButtons
