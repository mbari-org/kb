import { MdOutlineDeleteForever } from "react-icons/md"
import { MEDIA_STATE } from "@/lib/kb/concept/media"
import MediaActionButton from "../MediaActionButton"

const MediaDelete = ({ mediaIndex }) => (
  <MediaActionButton
    Icon={MdOutlineDeleteForever}
    color="cancel"
    action={MEDIA_STATE.DELETE}
    mediaIndex={mediaIndex}
    position="left"
  />
)

export default MediaDelete
