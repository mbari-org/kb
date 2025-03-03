import { use, useEffect, useState } from 'react'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import { MdOutlinePhoto } from 'react-icons/md'

import MediaDisplay from '@/components/kb/panels/concepts/detail/media/MediaDisplay'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import useHandleMediaChange from './useHandleMediaChange'
import useHandleMediaSubmit from './useHandleMediaSubmit'

import { hasPrimary, isPrimary } from '@/lib/kb/concept/media'
import { isValidUrl } from '@/lib/util'

// import useDebounce from '@/components/hooks/useDebounce'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

export const EDIT_MEDIA_FORM_ID = 'edit-media-form'

const EditMediaContent = ({ mediaIndex }) => {
  const { editingState, initialState, modifyConcept } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  const [mediaItem, setMediaItem] = useState(null)
  const [previewOn, setPreviewOn] = useState(false)
  const [showPrimaryCheckbox, setShowPrimaryCheckbox] = useState(false)
  const [changedFields, setChangedFields] = useState({
    url: false,
    credit: false,
    caption: false,
  })

  const handleSetMediaItem = formMediaItem => {
    setMediaItem(formMediaItem)

    modifyConcept({
      type: CONCEPT_STATE.MEDIA.EDIT,
      update: {
        mediaIndex,
        mediaItem: formMediaItem,
      },
    })
  }

  const { handleChange, urlStatus } = useHandleMediaChange(mediaItem, handleSetMediaItem)

  const handleSubmit = useHandleMediaSubmit(mediaIndex, setModal)

  const handleFieldChange = event => {
    const { name } = event.target
    const updatedMediaItem = handleChange(event)
    const changed = updatedMediaItem[name] !== initialState.media[mediaIndex][name]
    setChangedFields(prev => ({ ...prev, [name]: changed }))
  }

  const submitChange = event => {
    event.preventDefault()

    if (urlStatus.loading || !urlStatus.valid) {
      return
    }

    handleSubmit(event)
  }

  useEffect(() => {
    const mediaItem = editingState.media[mediaIndex] || {
      url: '',
      credit: '',
      caption: '',
      isPrimary: false,
    }

    setMediaItem(mediaItem)
    setShowPrimaryCheckbox(!hasPrimary(editingState.media) || isPrimary(mediaItem))
  }, [editingState.media, mediaIndex])

  if (!mediaItem) {
    return null
  }

  const urlError =
    changedFields.url &&
    (mediaItem.url.trim() === '' ||
      !isValidUrl(mediaItem.url) ||
      (!urlStatus.loading && !urlStatus.valid))

  const urlHelperText =
    mediaItem.url.trim() === ''
      ? 'URL cannot be empty'
      : !isValidUrl(mediaItem.url)
      ? 'Please enter a valid URL'
      : urlStatus.loading
      ? 'Checking URL...'
      : !urlStatus.valid
      ? 'URL is not accessible'
      : ''

  const urlSlotProps = {
    input: {
      endAdornment: (
        <InputAdornment position='end'>
          {!urlStatus.loading &&
            urlStatus.valid &&
            isValidUrl(mediaItem.url) &&
            mediaItem.url.trim() !== '' && (
              <IconButton onClick={() => setPreviewOn(true)} edge='end'>
                <Icon color='main' component={MdOutlinePhoto} sx={{ mb: 2, fontSize: 20 }} />
              </IconButton>
            )}
        </InputAdornment>
      ),
    },
  }

  const creditError = changedFields.credit && mediaItem.credit.trim() === ''
  const creditHelperText = mediaItem.credit.trim() === '' ? 'Credit cannot be empty' : ''

  return (
    <Box component='form' id={EDIT_MEDIA_FORM_ID} onSubmit={submitChange}>
      <FormControl fullWidth margin='normal'>
        <TextField
          error={urlError}
          helperText={changedFields.url ? urlHelperText : ''}
          label='URL'
          name='url'
          onChange={handleFieldChange}
          required
          slotProps={urlSlotProps}
          value={mediaItem.url}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          error={creditError}
          helperText={changedFields.credit ? creditHelperText : ''}
          label='Credit'
          name='credit'
          onChange={handleFieldChange}
          required
          value={mediaItem.credit}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Caption'
          name='caption'
          onChange={handleFieldChange}
          value={mediaItem.caption}
        />
      </FormControl>
      {showPrimaryCheckbox && (
        <Box display='flex' justifyContent='flex-end'>
          <FormControlLabel
            control={
              <Checkbox checked={mediaItem.isPrimary} name='isPrimary' onChange={handleChange} />
            }
            label='Is Primary'
          />
        </Box>
      )}
      <MediaDisplay
        mediaIndex={mediaIndex}
        previewOn={previewOn}
        setPreviewOn={setPreviewOn}
        url={mediaItem.url}
      />
    </Box>
  )
}

export default EditMediaContent
