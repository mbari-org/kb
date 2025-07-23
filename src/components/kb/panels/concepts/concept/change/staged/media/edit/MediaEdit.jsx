import { CiEdit } from 'react-icons/ci'

import MediaActionButton from '../MediaActionButton'

import { CONCEPT_STATE } from '@/lib/constants'

const MediaEdit = () => {
  return (
    <MediaActionButton
      action={CONCEPT_STATE.MEDIA.EDIT}
      color='edit'
      Icon={CiEdit}
      position='right'
      sx={{ mb: 1.25 }}
    />
  )
}

export default MediaEdit
