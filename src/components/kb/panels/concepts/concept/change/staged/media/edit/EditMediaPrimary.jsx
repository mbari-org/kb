import { useMemo } from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material'

import { hasPrimary, isPrimary } from '@/lib/model/media'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const { MEDIA } = CONFIG.PANELS.CONCEPTS.MODALS

const EditMediaPrimary = ({ action, mediaIndex, formMediaItem, stagedMedia, onChange }) => {
  const { isDisabled, shouldBeChecked } = useMemo(() => {
    const isAddingInitialMedia = action === CONCEPT_STATE.MEDIA_ITEM.ADD && !hasPrimary(stagedMedia)
    const isEditingOnlyMedia = action === CONCEPT_STATE.MEDIA_ITEM.EDIT && stagedMedia.length === 1

    if (isAddingInitialMedia || isEditingOnlyMedia) {
      return { isDisabled: true, shouldBeChecked: true }
    }

    return { isDisabled: false, shouldBeChecked: formMediaItem.isPrimary }
  }, [action, stagedMedia, formMediaItem.isPrimary, mediaIndex])

  return (
    <Box display='flex' justifyContent='flex-end'>
      <FormControlLabel
        control={
          <Checkbox
            checked={shouldBeChecked}
            disabled={isDisabled}
            name='isPrimary'
            onChange={onChange}
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
