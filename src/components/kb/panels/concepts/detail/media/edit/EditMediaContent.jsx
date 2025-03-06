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

import useHandleMediaSubmit from './useHandleMediaSubmit'

import { hasPrimary, isPrimary } from '@/lib/kb/concept/media'
import { checkImageUrlExists, isValidUrl } from '@/lib/util'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import { EMPTY_MEDIA_ITEM } from './mediaItem'

export const EDIT_MEDIA_FORM_ID = 'edit-media-form'

const EditMediaContent = ({ setMediaData }) => {
  const { editingState } = use(ConceptContext)
  const { modalData, setModal } = use(ModalContext)

  const { action, mediaIndex, mediaItem } = modalData

  const [formMediaItem, setFormMediaItem] = useState(mediaItem)

  const [modifiedFields, setModifiedFields] = useState({
    caption: false,
    credit: false,
    isPrimary: false,
    url: false,
  })
  const [previewOn, setPreviewOn] = useState(false)
  const [showPrimaryCheckbox, setShowPrimaryCheckbox] = useState(false)

  const [urlStatus, setUrlStatus] = useState({ loading: false, valid: true })
  const [urlCheckTimeout, setUrlCheckTimeout] = useState(null)

  const handleChange = event => {
    const { name, value, type, checked } = event.target

    const updatedMediaItem = {
      ...formMediaItem,
      [name]: type === 'checkbox' ? checked : value,
    }
    setFormMediaItem(updatedMediaItem)

    console.log('handleChange for action', action)

    const fieldIsModified =
      action === CONCEPT_STATE.MEDIA.ADD
        ? updatedMediaItem[name] !== EMPTY_MEDIA_ITEM[name]
        : editingState.media[mediaIndex][name] !== updatedMediaItem[name]

    const updatedModifiedFields = { ...modifiedFields, [name]: fieldIsModified }
    setModifiedFields(updatedModifiedFields)

    const modified = Object.values(updatedModifiedFields).some(fieldIsModified => fieldIsModified)

    setMediaData({
      modified,
      mediaItem: updatedMediaItem,
    })

    if (name === 'url') {
      checkUrlChange(value)
    }
  }

  const checkUrlChange = value => {
    // Delay URL validation check
    if (isValidUrl(value)) {
      // Clear any existing timeout
      if (urlCheckTimeout) {
        clearTimeout(urlCheckTimeout)
      }

      // Set loading state immediately
      setUrlStatus({ loading: true, valid: true })

      // Create new timeout for URL check
      const timeoutId = setTimeout(() => {
        checkImageUrlExists(value).then(exists => {
          setUrlStatus({ loading: false, valid: exists })
        })
      }, 500)

      setUrlCheckTimeout(timeoutId)
    }
  }

  const handleSubmit = useHandleMediaSubmit(mediaIndex, setModal)
  const submitChange = event => {
    if (!urlStatus.loading && urlStatus.valid) {
      handleSubmit(event)
    }
  }

  useEffect(() => {
    setShowPrimaryCheckbox(!hasPrimary(editingState.media) || isPrimary(mediaItem))
  }, [editingState.media, mediaIndex, mediaItem])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (urlCheckTimeout) {
        clearTimeout(urlCheckTimeout)
      }
    }
  }, [urlCheckTimeout])

  if (!mediaItem) {
    return null
  }

  const urlError =
    modifiedFields.url &&
    (formMediaItem.url.trim() === '' ||
      !isValidUrl(formMediaItem.url) ||
      (!urlStatus.loading && !urlStatus.valid))

  const urlHelperText =
    formMediaItem.url.trim() === ''
      ? 'URL cannot be empty'
      : !isValidUrl(formMediaItem.url)
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
            isValidUrl(formMediaItem.url) &&
            formMediaItem.url.trim() !== '' && (
              <IconButton onClick={() => setPreviewOn(true)} edge='end'>
                <Icon color='main' component={MdOutlinePhoto} sx={{ mb: 2, fontSize: 20 }} />
              </IconButton>
            )}
        </InputAdornment>
      ),
    },
  }

  const creditError = modifiedFields.credit && formMediaItem.credit.trim() === ''
  const creditHelperText = formMediaItem.credit.trim() === '' ? 'Credit cannot be empty' : ''

  return (
    <Box component='form' id={EDIT_MEDIA_FORM_ID} onSubmit={submitChange}>
      <FormControl fullWidth margin='normal'>
        <TextField
          error={urlError}
          helperText={modifiedFields.url ? urlHelperText : ''}
          label='URL'
          name='url'
          onChange={handleChange}
          required
          slotProps={urlSlotProps}
          value={formMediaItem.url}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          error={creditError}
          helperText={modifiedFields.credit ? creditHelperText : ''}
          label='Credit'
          name='credit'
          onChange={handleChange}
          required
          value={formMediaItem.credit}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Caption'
          name='caption'
          onChange={handleChange}
          value={formMediaItem.caption}
        />
      </FormControl>
      {showPrimaryCheckbox && (
        <Box display='flex' justifyContent='flex-end'>
          <FormControlLabel
            control={
              <Checkbox
                checked={formMediaItem.isPrimary}
                name='isPrimary'
                onChange={handleChange}
              />
            }
            label='Is Primary'
          />
        </Box>
      )}
      <MediaDisplay previewOn={previewOn} setPreviewOn={setPreviewOn} url={formMediaItem.url} />
    </Box>
  )
}

export default EditMediaContent
