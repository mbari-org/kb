import { CiEdit } from 'react-icons/ci'

import MediaAction from '@/components/kb/panels/concepts/concept/change/staged/media/MediaAction'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const { MEDIA } = CONFIG.PANELS.CONCEPTS.MODALS

const MediaEdit = () => {
  return (
    <MediaAction
      action={CONCEPT_STATE.MEDIA_ITEM.EDIT}
      color='edit'
      Icon={CiEdit}
      position='right'
      tooltip={MEDIA.EDIT.TOOLTIP}
      sx={{ mb: 1.25 }}
    />
  )
}

export default MediaEdit
