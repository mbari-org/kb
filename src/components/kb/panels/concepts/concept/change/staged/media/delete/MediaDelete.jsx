import { MdOutlineDeleteForever } from 'react-icons/md'

import MediaAction from '@/components/kb/panels/concepts/concept/change/staged/media/MediaAction'

import { CONCEPT_STATE } from '@/constants/conceptState.js'

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
