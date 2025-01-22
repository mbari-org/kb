import { use } from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import ConceptContext from "@/contexts/concept/ConceptContext"

const ConceptActions = () => {
  const { dispalyEditingState, editing, modified, processUpdates, setEditing } =
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
        onClick={() => (editing ? processUpdates("Cancel") : setEditing(true))}
        variant="contained"
      >
        {editing ? "Cancel" : "Edit"}
      </Button>
      {editing && modified && (
        <Button
          onClick={dispalyEditingState}
          sx={{ margin: "0 10px" }}
          variant="contained"
        >
          Show
        </Button>
      )}
      <Button
        disabled={!editing || !modified}
        onClick={() => processUpdates("Info")}
        variant="contained"
      >
        Save
      </Button>
    </Box>
  )
}

export default ConceptActions
