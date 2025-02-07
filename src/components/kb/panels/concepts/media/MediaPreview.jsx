import { use } from "react"
import { Box, Typography, IconButton, Tooltip } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { BsInfoCircle } from "react-icons/bs"

import ConceptContext from "@/contexts/concept/ConceptContext"

import { mediaBorder } from "@/lib/kb/concept/media"

const MediaPreview = ({ mediaIndex, setPreviewImage }) => {
  const theme = useTheme()
  const { editingState } = use(ConceptContext)
  const mediaItem = editingState.media[mediaIndex]

  const border = mediaBorder(mediaItem, theme)

  return (
    <>
      <Box
        sx={{
          border,
          height: "0",
          paddingBottom: "100%",
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <img
          alt={`Unable to Display Media: ${mediaItem?.url}`}
          onClick={() => setPreviewImage(true)}
          src={mediaItem?.url}
          style={{
            height: "100%",
            left: "50%",
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            objectPosition: "center",
            position: "absolute",
            top: "50%",
            width: "100%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          marginTop: 1,
          minHeight: "24px",
        }}
      >
        <Typography
          align="center"
          sx={{
            flexGrow: 1,
            textAlign: "center",
          }}
          variant="caption"
        >
          {mediaItem?.caption}
        </Typography>
        {mediaItem?.credit && (
          <Tooltip
            title={mediaItem?.credit}
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                },
              },
            }}
          >
            <IconButton
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
                padding: 0,
                marginLeft: 1,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  transform: "scale(1.25)",
                },
              }}
            >
              <BsInfoCircle size="18" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </>
  )
}

export default MediaPreview
