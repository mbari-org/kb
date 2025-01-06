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
          border: `1px solid ${theme.palette.grey[300]}`,
          height: "0",
          paddingBottom: "100%",
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <img
          alt={`Unable to Display Media: ${mediaSrc}`}
          onClick={openPreview}
          src={mediaSrc}
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
          minHeight: "24px", // Ensure the Box always takes the same space
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
