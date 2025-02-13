import { Box, Typography } from "@mui/material"

import MediaItemReset from "./MediaItemReset"
import MediaItemEditDetail from "./MediaItemEditDetail"

import { fieldSx } from "@/components/common/format"
// import { mediaItemEdits } from "@/lib/kb/concept/media"

const MediaItemEdit = ({ mediaItemEdit }) => {
  const [mediaIndex, itemAction, initialFields, pendingFields] = mediaItemEdit

  return (
    <Box
      sx={{
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <MediaItemReset mediaIndex={mediaIndex} />
        <Typography sx={fieldSx}>{itemAction}</Typography>
      </Box>
      <MediaItemEditDetail
        initialFields={initialFields}
        pendingFields={pendingFields}
      />
    </Box>
  )
}

export default MediaItemEdit
