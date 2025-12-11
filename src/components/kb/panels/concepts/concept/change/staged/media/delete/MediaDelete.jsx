import { MdOutlineDeleteForever } from 'react-icons/md'

import MediaAction from '@/components/kb/panels/concepts/concept/change/staged/media/MediaAction'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/config'

const { MEDIA } = CONFIG.PANELS.CONCEPTS.MODALS

const MediaDelete = () => {
  return (
    <MediaAction
      action={CONCEPT_STATE.MEDIA_ITEM.DELETE}
      color='cancel'
      Icon={MdOutlineDeleteForever}
      position='left'
      tooltip={MEDIA.DELETE.TOOLTIP}
      sx={{ mb: 1.25 }}
    />
  )
}

export default MediaDelete
