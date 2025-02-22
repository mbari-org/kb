import { use } from 'react'
import { useState, useEffect } from 'react'
import {
  Box,
  FormControl,
  TextField,
  InputAdornment,
  IconButton,
  Icon,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { MdOutlinePhoto } from 'react-icons/md'

import MediaDisplay from '@/components/kb/panels/concepts/detail/media/MediaDisplay'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import useHandleMediaChange from './useHandleMediaChange'
import useHandleMediaSubmit from './useHandleMediaSubmit'

import { hasPrimary, isPrimary } from '@/lib/kb/concept/media'
import { isValidUrl } from '@/lib/util'

export const EDIT_MEDIA_FORM_ID = 'edit-media-form'

const EditMediaContent = ({ mediaIndex }) => {
  const { editingState } = use(ConceptContext)
  const { data, setModal, setData } = use(ModalContext)

  const [showPrimaryCheckbox, setShowPrimaryCheckbox] = useState(false)
  const [previewOn, setPreviewOn] = useState(false)

  const { handleChange, urlStatus, setUrlStatus, urlCheckTimeout } = useHandleMediaChange(
    mediaIndex,
    setData
  )

  const handleSubmit = useHandleMediaSubmit(mediaIndex, data, setModal, setUrlStatus)

  useEffect(() => {
    const mediaItem = editingState.media[mediaIndex] || {
      url: '',
      credit: '',
      caption: '',
      isPrimary: false,
    }

    setData({
      initial: mediaItem,
      dirty: false,
      editing: mediaItem,
      touched: {},
    })
    setShowPrimaryCheckbox(!hasPrimary(editingState.media) || isPrimary(mediaItem))
  }, [editingState.media, mediaIndex, setData])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (urlCheckTimeout) {
        clearTimeout(urlCheckTimeout)
      }
    }
  }, [urlCheckTimeout])

  if (!data) {
    return null
  }

  return (
    <Box component='form' id={EDIT_MEDIA_FORM_ID} onSubmit={handleSubmit}>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='URL'
          name='url'
          onChange={handleChange}
          required
          value={data.editing.url}
          error={
            data.touched?.url &&
            (data.editing.url.trim() === '' ||
              !isValidUrl(data.editing.url) ||
              (!urlStatus.loading && !urlStatus.valid))
          }
          helperText={
            data.touched?.url
              ? data.editing.url.trim() === ''
                ? 'URL cannot be empty'
                : !isValidUrl(data.editing.url)
                ? 'Please enter a valid URL'
                : urlStatus.loading
                ? 'Checking URL...'
                : !urlStatus.valid
                ? 'URL is not accessible'
                : ''
              : ''
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  {!urlStatus.loading &&
                    urlStatus.valid &&
                    isValidUrl(data.editing.url) &&
                    data.editing.url.trim() !== '' && (
                      <IconButton onClick={() => setPreviewOn(true)} edge='end'>
                        <Icon
                          color='main'
                          component={MdOutlinePhoto}
                          sx={{ mb: 2, fontSize: 20 }}
                        />
                      </IconButton>
                    )}
                </InputAdornment>
              ),
            },
          }}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Credit'
          name='credit'
          onChange={handleChange}
          required
          value={data.editing.credit}
          error={data.touched?.credit && data.editing.credit.trim() === ''}
          helperText={
            data.touched?.credit && data.editing.credit.trim() === ''
              ? 'Credit cannot be empty'
              : ''
          }
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Caption'
          name='caption'
          onChange={handleChange}
          value={data.editing.caption}
        />
      </FormControl>
      {showPrimaryCheckbox && (
        <Box display='flex' justifyContent='flex-end'>
          <FormControlLabel
            control={
              <Checkbox checked={data.editing.isPrimary} name='isPrimary' onChange={handleChange} />
            }
            label='Is Primary'
          />
        </Box>
      )}
      <MediaDisplay
        mediaIndex={mediaIndex}
        previewOn={previewOn}
        setPreviewOn={setPreviewOn}
        url={data.editing.url}
      />
    </Box>
  )
}

export default EditMediaContent
