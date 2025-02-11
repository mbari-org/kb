import { Box, Typography } from "@mui/material"

// import MediaItemDetail from "./MediaItemDetail"
// import MediaItemReset from "./MediaItemReset"
import MediaReset from "./MediaReset"
import { mediaUpdates } from "@/lib/kb/concept/media"

const MediaDetails = ({ edit }) => {
  const [_field, { initial, pending }] = edit

  const updates = mediaUpdates(initial, pending)
  console.log(updates)

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <MediaReset />
      <Typography sx={{ fontSize: "1.25rem", whiteSpace: "pre-wrap" }}>
        Media
      </Typography>
      {/* <MediaItemDetail /> */}
    </Box>
  )
}

export default MediaDetails
