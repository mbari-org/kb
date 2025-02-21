import { MdOutlineAddPhotoAlternate } from 'react-icons/md'
import MediaActionButton from '../MediaActionButton'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

const MediaAdd = ({ bgColor, mediaIndex, sx }) => (
  <MediaActionButton
    action={CONCEPT_STATE.MEDIA_ADD}
    color='main'
    Icon={props => <MdOutlineAddPhotoAlternate {...props} size={24} />}
    mediaIndex={mediaIndex}
    sx={{
      ...sx,
      '& .MuiIconButton-root': {
        backgroundColor: bgColor,
        '&:hover': {
          backgroundColor: `${bgColor} !important`,
        },
      },
      backgroundColor: 'transparent',
      bottom: 'unset',
      left: '50%',
      right: 'unset',
      top: 0,
      transform: 'translateX(-50%)',
    }}
  />
)

export default MediaAdd
