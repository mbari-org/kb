import { MdOutlineAddPhotoAlternate } from 'react-icons/md'

import MediaActionButton from '@/components/kb/panels/concept/change/staged/concept/media/MediaActionButton'

import { CONCEPT_STATE } from '@/lib/constants'

const MediaAdd = ({ sx }) => {
  return (
    <MediaActionButton
      action={CONCEPT_STATE.MEDIA.ADD}
      color='add'
      Icon={props => <MdOutlineAddPhotoAlternate {...props} size={24} />}
      sx={{
        ...sx,
        backgroundColor: 'transparent',
        bottom: 'unset',
        left: '50%',
        right: 'unset',
        top: 0,
        transform: 'translateX(-50%)',
      }}
    />
  )
}

export default MediaAdd
