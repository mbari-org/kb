import { MdOutlineAddPhotoAlternate } from "react-icons/md"
import { MEDIA_STATE } from "@/lib/kb/concept/media"
import MediaActionButton from "../MediaActionButton"

const MediaAdd = ({ bgColor, mediaIndex, sx }) => (
  <MediaActionButton
    Icon={props => <MdOutlineAddPhotoAlternate {...props} size={24} />}
    color="main"
    action={MEDIA_STATE.ADD}
    mediaIndex={mediaIndex}
    sx={{
      ...sx,
      left: "50%",
      top: 0,
      transform: "translateX(-50%)",
      bottom: "unset",
      right: "unset",
      "& .MuiIconButton-root": {
        backgroundColor: bgColor,
        "&:hover": {
          backgroundColor: `${bgColor} !important`,
        },
      },
    }}
  />
)

export default MediaAdd
