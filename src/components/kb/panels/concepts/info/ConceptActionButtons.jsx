import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

const ConceptActionButtons = ({ editable, handleEditCancel, setEditable }) => {
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
        onClick={handleEditCancel}
        variant="contained"
      >
        {editable ? "Cancel" : "Edit"}
      </Button>
      <Button
        disabled={!editable}
        onClick={() => setEditable(false)}
        variant="contained"
      >
        Save
      </Button>
    </Box>
  )
}

export default ConceptActionButtons
