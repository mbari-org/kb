import { CiEdit } from 'react-icons/ci'

import MediaActionButton from '../MediaActionButton'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const MediaEdit = ({ mediaIndex }) => (
  <MediaActionButton
    action={CONCEPT_STATE.MEDIA.EDIT}
    color='main'
    Icon={CiEdit}
    mediaIndex={mediaIndex}
    position='right'
    sx={{
      mb: 1,
    }}
  />
)

export default MediaEdit
