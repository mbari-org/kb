import { CiEdit } from 'react-icons/ci'

import MediaAction from '../MediaAction'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const MEDIA_EDIT = 'Edit Media'

const MediaEdit = () => {
  return (
    <MediaAction
      action={CONCEPT_STATE.MEDIA_ITEM.EDIT}
      color='edit'
      Icon={CiEdit}
      position='right'
      tooltip={MEDIA_EDIT}
      sx={{ mb: 1.25 }}
    />
  )
}

export default MediaEdit
