import { useMemo } from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material'

import { hasPrimary } from '@/lib/model/media'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const { MEDIA } = CONFIG.PANELS.CONCEPTS.MODALS

const EditMediaPrimary = ({ action, formMediaItem, onPrimaryChange, stagedMedia }) => {
  const { isDisabled, shouldBeChecked } = useMemo(() => {
    const isAddingInitialMedia = action === CONCEPT_STATE.MEDIA_ITEM.ADD && !hasPrimary(stagedMedia)
    const isEditingSoloMedia = action === CONCEPT_STATE.MEDIA_ITEM.EDIT && stagedMedia.length === 1

    if (isAddingInitialMedia || isEditingSoloMedia) {
      return { isDisabled: true, shouldBeChecked: true }
    }

    return { isDisabled: false, shouldBeChecked: formMediaItem.isPrimary }
  }, [action, formMediaItem.isPrimary, stagedMedia])

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
