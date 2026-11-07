import { use, useCallback, useRef } from 'react'
import { FormControl, Icon, IconButton, InputAdornment, TextField } from '@mui/material'
import { MdOutlinePhoto } from 'react-icons/md'
import isValidUrl from '@/lib/validators/isValidUrl'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import useDebounce from '@/lib/hooks/useDebounce'
import isValidMedia from '@/lib/validators/isValidMedia'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/lib/config'

const URL_CHECK_DEBOUNCE_TIME = 500
const { URL } = CONFIG.PANELS.CONCEPTS.MODALS.MEDIA

const EditMediaUrl = ({ modifiedUrl, onUrlChange, onUrlStatusChange, setPreviewOn, urlStatus, urlValue }) => {
  const { concept } = use(ConceptContext)
  const { stagedState } = use(ConceptStagedContext)
  const { modalData } = use(ConceptModalDataContext)

  const { action, mediaIndex, mediaItem } = modalData
  const showPreviewButton =
    !urlStatus.loading &&
    urlStatus.valid &&
    isValidUrl(urlValue) &&
    urlValue.trim() !== '' &&
    (action !== CONCEPT_STATE.MEDIA_ITEM.ADD || modifiedUrl)

  const isDuplicateUrl = useCallback(
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

  const lastInputRef = useRef('')

  const debouncedUrlCheck = useDebounce(urlValue => {
    if (urlValue !== lastInputRef.current) return

    if (isValidUrl(urlValue)) {
      onUrlStatusChange({ loading: true, valid: true, isDuplicate: false })

      isValidMedia(urlValue).then(exists => {
        if (urlValue !== lastInputRef.current) return
        onUrlStatusChange({ loading: false, valid: exists, isDuplicate: false })
      })
    } else {
      onUrlStatusChange({ loading: false, valid: false, isDuplicate: false })
    }
  }, URL_CHECK_DEBOUNCE_TIME)

  const handleUrlInput = urlValue => {
    lastInputRef.current = urlValue
    const isDuplicate = urlValue !== mediaItem.url && isDuplicateUrl(urlValue)
    if (isDuplicate) {
      onUrlStatusChange({ isDuplicate: true, loading: false, valid: true })
    } else if (isValidUrl(urlValue)) {
      onUrlStatusChange({ isDuplicate: false, loading: true, valid: true })
      debouncedUrlCheck(urlValue)
    } else {
      onUrlStatusChange({ isDuplicate: false, loading: false, valid: false })
    }
    onUrlChange(urlValue)
  }

  const urlError =
    modifiedUrl &&
    (urlValue.trim() === '' ||
      !isValidUrl(urlValue) ||
      (!urlStatus.loading && !urlStatus.valid) ||
      urlStatus.isDuplicate)

  const urlHelperText =
    urlValue.trim() === ''
      ? URL.EMPTY_ERROR
      : urlStatus.isDuplicate
        ? URL.DUPLICATE_ERROR
        : !isValidUrl(urlValue)
          ? URL.INVALID_URL_ERROR
          : urlStatus.loading
            ? URL.CHECKING
            : !urlStatus.valid
              ? URL.INVALID_MEDIA_ERROR
              : ''

  const urlSlotProps = {
    input: {
      endAdornment: (
        <InputAdornment position='end'>
          {showPreviewButton && (
            <IconButton edge='end' onClick={() => setPreviewOn(true)}>
              <Icon color='main' component={MdOutlinePhoto} sx={{ mb: 2, fontSize: 20 }} />
            </IconButton>
          )}
        </InputAdornment>
      ),
    },
  }

  return (
    <FormControl fullWidth margin='normal'>
      <TextField
        error={urlError}
        helperText={modifiedUrl ? urlHelperText : ''}
        label={URL.LABEL}
        name='url'
        onChange={event => handleUrlInput(event.target.value)}
        required
        slotProps={urlSlotProps}
        value={urlValue}
      />
    </FormControl>
  )
}

export default EditMediaUrl
