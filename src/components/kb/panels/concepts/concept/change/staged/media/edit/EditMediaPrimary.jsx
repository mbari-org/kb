import { useMemo } from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material'

import { getItemMediaType, hasPrimaryOfType, mediaOfType } from '@/lib/model/media'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const { MEDIA } = CONFIG.PANELS.CONCEPTS.MODALS

const EditMediaPrimary = ({ action, formMediaItem, onPrimaryChange, stagedMedia }) => {
  const { isDisabled, shouldBeChecked } = useMemo(() => {
    const mediaType = getItemMediaType(formMediaItem)

    if (!mediaType) {
      return { isDisabled: false, shouldBeChecked: formMediaItem.isPrimary }
    }

    const sameTypeMedia = mediaOfType(stagedMedia, mediaType)
    const hasPrimaryForType = hasPrimaryOfType(sameTypeMedia, mediaType)

    const isAddingInitialMediaOfType =
      action === CONCEPT_STATE.MEDIA_ITEM.ADD && sameTypeMedia.length === 0 && !hasPrimaryForType

    const isEditingSoloMediaOfType =
      action === CONCEPT_STATE.MEDIA_ITEM.EDIT && sameTypeMedia.length === 1

    // For EDITs, determine if this media item was primary before any edits in the form.
    const originalItem =
      action === CONCEPT_STATE.MEDIA_ITEM.EDIT
        ? stagedMedia.find(item => item.id && item.id === formMediaItem.id)
        : null
    const wasInitiallyPrimary = !!originalItem?.isPrimary

    const isEditingInitiallyPrimaryOfType =
      action === CONCEPT_STATE.MEDIA_ITEM.EDIT && wasInitiallyPrimary

    if (isAddingInitialMediaOfType || isEditingSoloMediaOfType || isEditingInitiallyPrimaryOfType) {
      return { isDisabled: true, shouldBeChecked: true }
    }

    return { isDisabled: false, shouldBeChecked: formMediaItem.isPrimary }
  }, [action, formMediaItem, stagedMedia])

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
