import { MdOutlineDeleteForever } from 'react-icons/md'

import MediaAction from '../MediaAction'

import { CONCEPT_STATE } from '@/lib/constants'

const MEDIA_DELETE = 'Delete Media'

const MediaDelete = () => {
  return (
    <MediaAction
      action={CONCEPT_STATE.MEDIA_ITEM.DELETE}
      color='cancel'
      Icon={MdOutlineDeleteForever}
      position='left'
      tooltip={MEDIA_DELETE}
      sx={{ mb: 1.25 }}
    />
  )
}

export default MediaDelete
