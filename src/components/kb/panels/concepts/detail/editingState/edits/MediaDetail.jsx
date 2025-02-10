import { Box } from "@mui/material"

const MediaDetail = mediaItem => {
  return (
    <Box>
      <p>{mediaItem.url}</p>
      <p>{mediaItem.caption}</p>
      <p>{mediaItem.credit}</p>
    </Box>
  )
}

export default MediaDetail
