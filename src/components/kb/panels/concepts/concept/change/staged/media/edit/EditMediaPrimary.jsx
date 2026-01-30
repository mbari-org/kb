import { useMemo } from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material'

import { hasPrimary, isPrimary } from '@/lib/model/media'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const { MEDIA } = CONFIG.PANELS.CONCEPTS.MODALS

const EditMediaPrimary = ({ action, mediaIndex, formMediaItem, stagedMedia, onChange }) => {
  const showPrimaryCheckbox = useMemo(() => {
    if (action === CONCEPT_STATE.MEDIA_ITEM.ADD) {
      return !hasPrimary(stagedMedia)
    }

    const otherMedia = stagedMedia.filter((_, index) => index !== mediaIndex)
    const hasOtherPrimary = hasPrimary(otherMedia)
    const wasOriginallyPrimary = isPrimary(stagedMedia[mediaIndex])

    return !hasOtherPrimary || wasOriginallyPrimary
  }, [stagedMedia, action, mediaIndex])

  if (!showPrimaryCheckbox) {
    return null
  }

  return (
    <Box display='flex' justifyContent='flex-end'>
      <FormControlLabel
        control={
          <Checkbox
            checked={formMediaItem.isPrimary}
            name='isPrimary'
            onChange={onChange}
          />
        }
        label={MEDIA.EDIT.PRIMARY}
      />
    </Box>
  )
}

export default EditMediaPrimary
