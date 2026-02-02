import { useMemo } from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material'

import { getMediaType, hasPrimaryOfType, mediaOfType } from '@/lib/model/media'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const { MEDIA } = CONFIG.PANELS.CONCEPTS.MODALS

const EditMediaPrimary = ({ action, formMediaItem, onPrimaryChange, stagedMedia }) => {
  const { isDisabled, shouldBeChecked } = useMemo(() => {
    const mediaType = getMediaType(formMediaItem.url)
    const sameTypeMedia = mediaOfType(stagedMedia, mediaType)
    const hasPrimaryForType = hasPrimaryOfType(sameTypeMedia, mediaType)

    const isAddingInitialMediaOfType =
      action === CONCEPT_STATE.MEDIA_ITEM.ADD && !hasPrimaryForType
    const isEditingSoloMediaOfType =
      action === CONCEPT_STATE.MEDIA_ITEM.EDIT && sameTypeMedia.length === 1

    if (isAddingInitialMediaOfType || isEditingSoloMediaOfType) {
      return { isDisabled: true, shouldBeChecked: true }
    }

    return { isDisabled: false, shouldBeChecked: formMediaItem.isPrimary }
  }, [action, formMediaItem.isPrimary, formMediaItem.url, stagedMedia])

  return (
    <Box display='flex' justifyContent='flex-end'>
      <FormControlLabel
        control={
          <Checkbox
            checked={shouldBeChecked}
            disabled={isDisabled}
            name='isPrimary'
            onChange={onPrimaryChange}
          />
        }
        label={
          <Typography sx={{ color: 'text.primary' }}>
            {MEDIA.EDIT.PRIMARY}
          </Typography>
        }
      />
    </Box>
  )
}

export default EditMediaPrimary
