import { use } from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptActionButtons = () => {
  const {
    displayConceptEditsAlert,
    editing,
    modified,
    processUpdates,
    setEditing,
  } = use(ConceptContext)

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 60,
        left: 10,
        right: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button
        color={editing ? "cancel" : "main"}
        onClick={() => (editing ? processUpdates(false) : setEditing(true))}
        variant="contained"
      >
        {editing ? "Cancel" : "Edit"}
      </Button>
      {editing && modified && (
        <Button
          onClick={displayConceptEditsAlert}
          variant="contained"
          sx={{ margin: "0 10px" }}
        >
          Show
        </Button>
      )}
      <Button
        disabled={!editing || !modified}
        onClick={() => processUpdates(true)}
        variant="contained"
      >
        Save
      </Button>
    </Box>
  )
}

export default ConceptActionButtons
