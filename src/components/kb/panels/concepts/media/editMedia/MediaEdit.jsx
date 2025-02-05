import { CiEdit } from "react-icons/ci"

import MediaActionButton from "./MediaActionButton"

import { CONCEPT } from "@/contexts/concept/lib/conceptStateReducer"

const MediaEdit = ({ mediaIndex }) => (
  <MediaActionButton
    action={CONCEPT.MEDIA_EDIT}
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
