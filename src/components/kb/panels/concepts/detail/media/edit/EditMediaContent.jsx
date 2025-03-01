import { use, useState, useEffect } from 'react'
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

import useWhyUpdate from '@/components/hooks/useWhyUpdate'

export const EDIT_MEDIA_FORM_ID = 'edit-media-form'

const EditMediaContent = ({ mediaIndex }) => {
  const { editingState } = use(ConceptContext)
  const { modalData, setModal, setModalData } = use(ModalContext)

  const [showPrimaryCheckbox, setShowPrimaryCheckbox] = useState(false)
  const [previewOn, setPreviewOn] = useState(false)

  const { handleChange, urlStatus, setUrlStatus, urlCheckTimeout } =
    useHandleMediaChange(setModalData)

  const handleSubmit = useHandleMediaSubmit(mediaIndex, modalData, setModal, setUrlStatus)

  useWhyUpdate('EditMediaContent', { mediaIndex, modalData, setModal, setModalData })

  useEffect(() => {
    const mediaItem = editingState.media[mediaIndex] || {
      url: '',
      credit: '',
      caption: '',
      isPrimary: false,
    }

    setModalData({
      initial: mediaItem,
      dirty: false,
      editing: mediaItem,
      touched: {},
    })
    setShowPrimaryCheckbox(!hasPrimary(editingState.media) || isPrimary(mediaItem))
  }, [editingState.media, mediaIndex, setModalData])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (urlCheckTimeout) {
        clearTimeout(urlCheckTimeout)
      }
    }
  }, [urlCheckTimeout])

  if (!modalData?.touched) {
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
          value={modalData.editing.url}
          error={
            modalData.touched?.url &&
            (modalData.editing.url.trim() === '' ||
              !isValidUrl(modalData.editing.url) ||
              (!urlStatus.loading && !urlStatus.valid))
          }
          helperText={
            modalData.touched?.url
              ? modalData.editing.url.trim() === ''
                ? 'URL cannot be empty'
                : !isValidUrl(modalData.editing.url)
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
                    isValidUrl(modalData.editing.url) &&
                    modalData.editing.url.trim() !== '' && (
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
          value={modalData.editing.credit}
          error={modalData.touched?.credit && modalData.editing.credit.trim() === ''}
          helperText={
            modalData.touched?.credit && modalData.editing.credit.trim() === ''
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
          value={modalData.editing.caption}
        />
      </FormControl>
      {showPrimaryCheckbox && (
        <Box display='flex' justifyContent='flex-end'>
          <FormControlLabel
            control={
              <Checkbox
                checked={modalData.editing.isPrimary}
                name='isPrimary'
                onChange={handleChange}
              />
            }
            label='Is Primary'
          />
        </Box>
      )}
      <MediaDisplay
        mediaIndex={mediaIndex}
        previewOn={previewOn}
        setPreviewOn={setPreviewOn}
        url={modalData.editing.url}
      />
    </Box>
  )
}

export default EditMediaContent
