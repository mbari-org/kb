import { MdOutlineAddPhotoAlternate } from 'react-icons/md'

import MediaActionButton from '@/components/kb/panels/concepts/concept/change/staged/concept/media/MediaActionButton'

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
      }}
    />
  )
}

export default MediaAdd
