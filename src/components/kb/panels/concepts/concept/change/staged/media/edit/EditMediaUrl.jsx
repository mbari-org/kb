import { use, useCallback, useState } from 'react'
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
import { checkImageUrlExists, isUrlValid } from '@/lib/utils'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const EditMediaUrl = ({
  value,
  onUrlChange,
  onUrlStatusChange,
  modifiedUrl,
}) => {
  const { concept, stagedState } = use(ConceptContext)
  const { modalData } = use(ConceptModalContext)

  const { action, mediaIndex, mediaItem } = modalData

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

  const debouncedUrlCheck = useDebounce(urlValue => {
    if (isUrlValid(urlValue)) {
      const loadingStatus = { loading: true, valid: true, isDuplicate: false }
      setUrlStatus(loadingStatus)
      onUrlStatusChange(loadingStatus)

      checkImageUrlExists(urlValue).then(exists => {
        const finalStatus = { loading: false, valid: exists, isDuplicate: false }
        setUrlStatus(finalStatus)
        onUrlStatusChange(finalStatus)
      })
    } else {
      setUrlStatus({ loading: false, valid: false, isDuplicate: false })
    }
  }, 500)

  const handleUrlChange = newValue => {
    const isDuplicate = newValue !== mediaItem.url && isDuplicateURL(newValue)
    let newUrlStatus

    if (isDuplicate) {
      newUrlStatus = { isDuplicate: true, loading: false, valid: true }
      setUrlStatus(newUrlStatus)
      onUrlStatusChange(newUrlStatus)
    } else if (isUrlValid(newValue)) {
      newUrlStatus = { isDuplicate: false, loading: true, valid: true }
      setUrlStatus(newUrlStatus)
      onUrlStatusChange(newUrlStatus)
      debouncedUrlCheck(newValue)
    } else {
      newUrlStatus = { isDuplicate: false, loading: false, valid: false }
      setUrlStatus(newUrlStatus)
      onUrlStatusChange(newUrlStatus)
    }

    onUrlChange(newValue)
  }

  const urlError =
    modifiedUrl &&
    (value.trim() === '' ||
      !isUrlValid(value) ||
      (!urlStatus.loading && !urlStatus.valid) ||
      urlStatus.isDuplicate)

  const urlHelperText =
    value.trim() === ''
      ? 'URL cannot be empty'
      : urlStatus.isDuplicate
        ? 'This media is already being used'
        : !isUrlValid(value)
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
            isUrlValid(value) &&
            value.trim() !== '' && (
              <IconButton edge='end'>
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
        onChange={e => handleUrlChange(e.target.value)}
        required
        slotProps={urlSlotProps}
        value={value}
      />
    </FormControl>
  )
}

export default EditMediaUrl
