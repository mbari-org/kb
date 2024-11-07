import { Dialog } from "@mui/material"

import MediaPreviewTransition from "./MediaPreviewTransition"

const MediaPreview = ({ closePreview, mediaSrc, previewImage }) => {
  return (
    <Dialog
      fullScreen
      open={previewImage}
      TransitionComponent={MediaPreviewTransition}
    >
      <img
        src={mediaSrc}
        alt="Concept Media Display"
        onClick={closePreview}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </Dialog>
  )
}

export default MediaPreview
