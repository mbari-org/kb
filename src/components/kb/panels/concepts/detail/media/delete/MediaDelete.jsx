import { MdOutlineDeleteForever } from 'react-icons/md'

import MediaActionButton from '../MediaActionButton'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

const MediaDelete = () => {
  return (
    <MediaActionButton
      action={CONCEPT_STATE.MEDIA.DELETE}
      color='cancel'
      Icon={MdOutlineDeleteForever}
      position='left'
      sx={{
        mb: 1,
      }}
    />
  )
}

export default MediaDelete
