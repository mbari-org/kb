import { CiEdit } from "react-icons/ci"
import { MEDIA_STATE } from "@/lib/kb/concept/media"
import MediaActionButton from "../MediaActionButton"

const MediaEdit = ({ mediaIndex }) => (
  <MediaActionButton
    Icon={CiEdit}
    color="main"
    action={MEDIA_STATE.EDIT}
    mediaIndex={mediaIndex}
    position="right"
  />
)

export default MediaEdit
