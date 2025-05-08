import { MdOutlineAddPhotoAlternate } from 'react-icons/md'

import MediaActionButton from '../MediaActionButton'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const MediaAdd = ({ bgColor, sx }) => {
  return (
    <MediaActionButton
      action={CONCEPT_STATE.MEDIA.ADD}
      color='add'
      Icon={props => <MdOutlineAddPhotoAlternate {...props} size={24} />}
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
}

export default MediaAdd
