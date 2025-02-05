import { use } from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptActions = () => {
  const { displayEditingState, editing, modified, setEditing, submitUpdates } =
    use(ConceptContext)

  return (
    <Box
      sx={{
        alignItems: "center",
        bottom: 65,
        display: "flex",
        justifyContent: "space-between",
        left: 10,
        position: "absolute",
        right: 15,
      }}
    >
      <Button
        color={editing ? "cancel" : "main"}
        onClick={() => (editing ? submitUpdates(false) : setEditing(true))}
        variant="contained"
      >
        {editing ? "Cancel" : "Edit"}
      </Button>
      {editing && modified && (
        <Button
          onClick={displayEditingState}
          sx={{ margin: "0 10px" }}
          variant="contained"
        >
          Show
        </Button>
      )}
      <Button
        disabled={!editing || !modified}
        onClick={() => submitUpdates(true)}
        variant="contained"
      >
        Save
      </Button>
    </Box>
  )
}

export default ConceptActions
