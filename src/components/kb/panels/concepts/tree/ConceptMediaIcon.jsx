import Box from "@mui/material/Box"

import { FaImage, FaImages } from "react-icons/fa6"

const ConceptMediaIcon = ({ mediaCount }) => {
  if (mediaCount === 0) {
    return null
  }

  const MediaIcon = mediaCount === 1 ? FaImage : FaImages

  return (
    <Box sx={{ ml: 0.5, mr: 1, maxWidth: "12px" }}>
      <MediaIcon />
    </Box>
  )
}

export default ConceptMediaIcon
