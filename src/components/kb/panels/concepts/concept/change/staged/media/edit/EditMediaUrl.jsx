import { use, useCallback } from 'react'
import {
  FormControl,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import { MdOutlinePhoto } from 'react-icons/md'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useDebounce from '@/lib/hooks/useDebounce'
import { checkMediaUrlExists } from '@/lib/model/media'
import { isUrlValid } from '@/lib/utils'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const URL_CHECK_DEBOUNCE_TIME = 500

const EditMediaUrl = ({
  modifiedUrl,
  onUrlChange,
  onUrlStatusChange,
  setPreviewOn,
  urlStatus,
  urlValue,
}) => {
  const { concept, stagedState } = use(ConceptContext)
  const { modalData } = use(ConceptModalContext)

  const { action, mediaIndex, mediaItem } = modalData

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

  const debouncedUrlCheck = useDebounce(urlValue => {
    if (isUrlValid(urlValue)) {
      const loadingStatus = { loading: true, valid: true, isDuplicate: false }
      onUrlStatusChange(loadingStatus)

      checkMediaUrlExists(urlValue).then(exists => {
        const finalStatus = { loading: false, valid: exists, isDuplicate: false }
        onUrlStatusChange(finalStatus)
      })
    } else {
      onUrlStatusChange({ loading: false, valid: false, isDuplicate: false })
    }
  }, URL_CHECK_DEBOUNCE_TIME)

  const handleUrlInput = urlValue => {
    const isDuplicate = urlValue !== mediaItem.url && isDuplicateUrl(urlValue)
    if (isDuplicate) {
      onUrlStatusChange({ isDuplicate: true, loading: false, valid: true })
    } else if (isUrlValid(urlValue)) {
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
      !isUrlValid(urlValue) ||
      (!urlStatus.loading && !urlStatus.valid) ||
      urlStatus.isDuplicate)

  const urlHelperText =
    urlValue.trim() === ''
      ? 'URL cannot be empty'
      : urlStatus.isDuplicate
        ? 'This media is already being used'
        : !isUrlValid(urlValue)
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
            isUrlValid(urlValue) &&
            urlValue.trim() !== '' && (
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
        label='URL'
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
