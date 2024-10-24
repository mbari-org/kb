import ImageIcon from "@mui/icons-material/Image"
import Box from "@mui/material/Box"

const ConceptImageIcon = ({ hasMedia }) => {
  return (
    <Box sx={{ width: "16px" }}>
      {hasMedia && <ImageIcon sx={{ maxWidth: "16px" }} />}
    </Box>
  )
}

export default ConceptImageIcon
