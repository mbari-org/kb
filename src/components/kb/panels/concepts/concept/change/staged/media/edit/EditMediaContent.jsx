import { use, useCallback, useMemo, useState } from 'react'
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
import ModalActionText from '@/components/common/ModalActionText'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useStageMedia from './useStageMedia'
import useDebounce from '@/lib/hooks/useDebounce'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'
import { hasPrimary, isPrimary } from '@/lib/model/media'
import { checkImageUrlExists, isUrlValid } from '@/lib/utils'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { EMPTY_MEDIA_ITEM } from './mediaItem'
import CONFIG from '@/text'

import { ACTION } from '@/lib/constants'

const { MEDIA } = CONFIG.PANELS.CONCEPTS.MODALS

export const EDIT_MEDIA_FORM_ID = 'edit-media-form'

const EditMediaContent = () => {
  const { concept, stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)

  const { action, mediaIndex, mediaItem } = modalData

  const [formMediaItem, setFormMediaItem] = useState(mediaItem)
  const actionText = actionVerb(action)

  const [modifiedFields, setModifiedFields] = useState({
    caption: false,
    credit: false,
    isPrimary: false,
    url: false,
  })
  const [previewOn, setPreviewOn] = useState(false)

  const [urlStatus, setUrlStatus] = useState({ loading: false, valid: true, isDuplicate: false })

  const isDuplicateURL = useCallback(
    url => {
      const inInitialMedia = concept.media.some(item => item.url === url)
      const inStagedMedia = stagedState.media.some((item, index) => {
        if (action === CONCEPT_STATE.MEDIA_ITEM.EDIT && index === mediaIndex) {
          return false
        }
        return item.url === url
      })

      return inInitialMedia || inStagedMedia
    },
    [concept.media, stagedState.media, action, mediaIndex]
  )

  const debouncedUpdateForm = useDebounce((updatedMediaItem, fieldIsModified, field) => {
    const updatedModifiedFields = { ...modifiedFields, [field]: fieldIsModified }
    setModifiedFields(updatedModifiedFields)

    const modified = Object.values(updatedModifiedFields).some(fieldIsModified => fieldIsModified)

    setModalData(prev => ({ ...prev, mediaItem: updatedMediaItem, modified }))
  }, 300)

  const debouncedUrlCheck = useDebounce(value => {
    if (isUrlValid(value)) {
      setUrlStatus({ loading: true, valid: true, isDuplicate: false })

      checkImageUrlExists(value).then(exists => {
        const isDuplicate = value !== mediaItem.url && isDuplicateURL(value)
        setUrlStatus({ loading: false, valid: exists, isDuplicate })
      })
    } else {
      setUrlStatus({ loading: false, valid: false, isDuplicate: false })
    }
  }, 500)

  const handleChange = event => {
    const { name: field, value, type, checked } = event.target

    const updatedMediaItem = {
      ...formMediaItem,
      [field]: type === 'checkbox' ? checked : value,
    }

    setFormMediaItem(updatedMediaItem)

    const fieldIsModified =
      action === CONCEPT_STATE.MEDIA_ITEM.ADD
        ? updatedMediaItem[field] !== EMPTY_MEDIA_ITEM[field]
        : stagedState.media[mediaIndex][field] !== updatedMediaItem[field]

    debouncedUpdateForm(updatedMediaItem, fieldIsModified, field)

    if (field === 'url') {
      debouncedUrlCheck(value)
    }
  }

  const stageMedia = useStageMedia()
  const stageChange = event => {
    if (!urlStatus.loading && urlStatus.valid) {
      stageMedia(event)
    }
  }

  const showPrimaryCheckbox = useMemo(() => {
    if (action === CONCEPT_STATE.MEDIA_ITEM.ADD) {
      return !hasPrimary(stagedState.media)
    }

    const otherMedia = stagedState.media.filter((_, index) => index !== mediaIndex)
    const hasOtherPrimary = hasPrimary(otherMedia)

    const wasOriginallyPrimary = isPrimary(stagedState.media[mediaIndex])

    return !hasOtherPrimary || wasOriginallyPrimary
  }, [stagedState.media, action, mediaIndex])

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
            formMediaItem.url.trim() !== '' &&
            (<IconButton onClick={() => setPreviewOn(true)} edge='end'>
              <Icon color='main' component={MdOutlinePhoto} sx={{ mb: 2, fontSize: 20 }} />
            </IconButton>
            )}
        </InputAdornment>
      ),
    },
  }

  const modalActionText = actionText === ACTION.EDIT ? MEDIA.EDIT.LABEL : MEDIA.ADD.LABEL

  const creditError = modifiedFields.credit && formMediaItem.credit.trim() === ''
  const creditHelperText = formMediaItem.credit.trim() === '' ? 'Credit cannot be empty' : ''

  return (
    <Box component='form' id={EDIT_MEDIA_FORM_ID} onSubmit={stageChange}>
      <ModalActionText text={modalActionText} />
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
            label={MEDIA.EDIT.PRIMARY}
          />
        </Box>
      )}
      <MediaDisplay previewOn={previewOn} setPreviewOn={setPreviewOn} url={formMediaItem.url} />
    </Box>
  )
}

export default EditMediaContent
