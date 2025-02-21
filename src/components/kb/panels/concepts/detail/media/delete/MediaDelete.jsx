import { MdOutlineDeleteForever } from 'react-icons/md'
import MediaActionButton from '../MediaActionButton'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

const MediaDelete = ({ mediaIndex }) => (
  <MediaActionButton
    action={CONCEPT_STATE.MEDIA_DELETE}
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
