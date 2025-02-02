import { MdOutlineDeleteForever } from "react-icons/md"
import MediaActionButton from "./MediaActionButton"

import { CONCEPT_STATE } from "@/contexts/concept/lib/conceptStateReducer"

const MediaDelete = ({ mediaIndex }) => (
  <MediaActionButton
    action={CONCEPT_STATE.DELETE_MEDIA}
    color="cancel"
    Icon={MdOutlineDeleteForever}
    mediaIndex={mediaIndex}
    position="left"
    sx={{
      mb: 1,
    }}
  />
)

export default MediaDelete
