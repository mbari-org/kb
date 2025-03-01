import { MdOutlineDeleteForever } from 'react-icons/md'
import MediaActionButton from '../MediaActionButton'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const MediaDelete = ({ mediaIndex }) => (
  <MediaActionButton
    action={CONCEPT_STATE.MEDIA.DELETE}
    color='cancel'
    Icon={MdOutlineDeleteForever}
    mediaIndex={mediaIndex}
    position='left'
    sx={{
      mb: 1,
    }}
  />
)

export default MediaDelete
