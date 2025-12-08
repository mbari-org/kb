import { MdOutlineAddPhotoAlternate } from 'react-icons/md'

import MediaAction from '@/components/kb/panels/concepts/concept/change/staged/media/MediaAction'

import { CONCEPT_STATE } from '@/constants/conceptState.js'

const MEDIA_ADD = 'Add Media'

const MediaAdd = ({ position, size, sx }) => {
  return (
    <MediaAction
      action={CONCEPT_STATE.MEDIA_ITEM.ADD}
      color='add'
      Icon={MdOutlineAddPhotoAlternate}
      position={position}
      size={size}
      sx={{
        ...sx,
        backgroundColor: 'transparent',
      }}
      tooltip={MEDIA_ADD}
    />
  )
}

export default MediaAdd
