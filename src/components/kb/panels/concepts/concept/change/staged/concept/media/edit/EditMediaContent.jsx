import { use, useCallback, useEffect, useState } from 'react'
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

import MediaDisplay from '@/components/kb/panels/concepts/concept/detail/media/MediaDisplay'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PanelModalContext from '@/contexts/modal/PanelModalContext'

import useStageMedia from './useStageMedia'

import { hasPrimary, isPrimary } from '@/lib/kb/model/media'
import { checkImageUrlExists, isUrlValid } from '@/lib/utils'

import { CONCEPT_STATE } from '@/lib/constants'
import { EMPTY_MEDIA_ITEM } from './mediaItem'

export const EDIT_MEDIA_FORM_ID = 'edit-media-form'

const EditMediaContent = () => {
  const { concept, stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(PanelModalContext)

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

  const [urlStatus, setUrlStatus] = useState({ loading: false, valid: true, isDuplicate: false })
  const [urlCheckTimeout, setUrlCheckTimeout] = useState(null)

  const handleChange = event => {
    const { name: field, value, type, checked } = event.target

    const updatedMediaItem = {
      ...formMediaItem,
      [field]: type === 'checkbox' ? checked : value,
    }
    setFormMediaItem(updatedMediaItem)

    const fieldIsModified =
      action === CONCEPT_STATE.MEDIA.ADD
        ? updatedMediaItem[field] !== EMPTY_MEDIA_ITEM[field]
        : stagedState.media[mediaIndex][field] !== updatedMediaItem[field]

    const updatedModifiedFields = { ...modifiedFields, [field]: fieldIsModified }
    setModifiedFields(updatedModifiedFields)

    const modified = Object.values(updatedModifiedFields).some(fieldIsModified => fieldIsModified)

    setModalData(prev => ({ ...prev, mediaItem: updatedMediaItem, modified }))

    if (field === 'url') {
      checkUrlChange(value)
    }
  }

  const isUrlDuplicate = useCallback(
    url => {
      return concept.media.some(item => item.url === url)
    },
    [concept.media]
  )

  const checkUrlChange = value => {
    // Delay URL validation check
    if (isUrlValid(value)) {
      // Clear any existing timeout
      if (urlCheckTimeout) {
        clearTimeout(urlCheckTimeout)
      }

      // Set loading state immediately
      setUrlStatus({ loading: true, valid: true, isDuplicate: false })

      // Create new timeout for URL check
      const timeoutId = setTimeout(() => {
        checkImageUrlExists(value).then(exists => {
          const isDuplicate = value !== mediaItem.url && isUrlDuplicate(value)
          setUrlStatus({ loading: false, valid: exists, isDuplicate })
        })
      }, 500)

      setUrlCheckTimeout(timeoutId)
    }
  }

  const stageMedia = useStageMedia()
  const stageChange = event => {
    if (!urlStatus.loading && urlStatus.valid) {
      stageMedia(event)
    }
  }

  useEffect(() => {
    setShowPrimaryCheckbox(!hasPrimary(stagedState.media) || isPrimary(mediaItem))
  }, [stagedState.media, mediaIndex, mediaItem])

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
      !isUrlValid(formMediaItem.url) ||
      (!urlStatus.loading && !urlStatus.valid) ||
      urlStatus.isDuplicate)

  const urlHelperText =
    formMediaItem.url.trim() === ''
      ? 'URL cannot be empty'
      : !isUrlValid(formMediaItem.url)
      ? 'Please enter a valid URL'
      : urlStatus.loading
      ? 'Checking URL...'
      : !urlStatus.valid
      ? 'URL is not accessible'
      : urlStatus.isDuplicate
      ? 'This media is already being used'
      : ''

  const urlSlotProps = {
    input: {
      endAdornment: (
        <InputAdornment position='end'>
          {!urlStatus.loading &&
            urlStatus.valid &&
            isUrlValid(formMediaItem.url) &&
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
    <Box component='form' id={EDIT_MEDIA_FORM_ID} onSubmit={stageChange}>
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
