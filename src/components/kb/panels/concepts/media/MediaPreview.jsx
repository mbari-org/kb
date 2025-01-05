import { Box, Typography, IconButton, Tooltip } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { BsInfoCircle } from "react-icons/bs"

const MediaPreview = ({ previewMedia, openPreview }) => {
  const theme = useTheme()

  const mediaSrc = previewMedia?.url

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "0",
          paddingBottom: "100%",
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${theme.palette.grey[300]}`,
        }}
      >
        <img
          src={mediaSrc}
          alt={`Unable to Display Media: ${mediaSrc}`}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            transform: "translate(-50%, -50%)",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          onClick={openPreview}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
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
          {previewMedia?.caption}
        </Typography>
        {previewMedia?.credit && (
          <Tooltip
            title={previewMedia?.credit}
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
