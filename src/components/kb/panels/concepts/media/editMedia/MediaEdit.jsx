import { CiEdit } from "react-icons/ci"

import MediaActionButton from "./MediaActionButton"

import { CONCEPT_STATE } from "@/contexts/concept/lib/conceptStateReducer"

const MediaEdit = ({ mediaIndex }) => (
  <MediaActionButton
    action={CONCEPT_STATE.EDIT_MEDIA}
    color="main"
    Icon={CiEdit}
    mediaIndex={mediaIndex}
    position="right"
    sx={{
      mb: 1,
    }}
  />
)

export default MediaEdit
