import { Dialog } from "@mui/material"
import { Zoom } from "@mui/material"

const MediaPreview = ({ closePreview, mediaSrc, previewImage }) => {
  return (
    <Dialog fullScreen open={previewImage} TransitionComponent={Zoom}>
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
