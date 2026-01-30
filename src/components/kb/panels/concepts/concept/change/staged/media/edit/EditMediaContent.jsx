import { use, useEffect, useState } from 'react'
import {
  Box,
  FormControl,
  TextField,
} from '@mui/material'

import EditMediaUrl from './EditMediaUrl'
import EditMediaPrimary from './EditMediaPrimary'
import MediaDisplay from '@/components/kb/panels/concepts/concept/detail/media/MediaDisplay'
import ModalActionText from '@/components/common/ModalActionText'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useStageMedia from './useStageMedia'
import useDebounce from '@/lib/hooks/useDebounce'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'
import { isUrlValid } from '@/lib/utils'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { EMPTY_MEDIA_ITEM } from './mediaItem'
import CONFIG from '@/text'

import { ACTION } from '@/lib/constants'

const { MEDIA } = CONFIG.PANELS.CONCEPTS.MODALS

export const EDIT_MEDIA_FORM_ID = 'edit-media-form'

const EditMediaContent = () => {
  const { stagedState } = use(ConceptContext)
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

  useEffect(() => {
    const hasCreditError = formMediaItem.credit.trim() === ''
    const hasUrlError = formMediaItem.url.trim() === '' ||
      !isUrlValid(formMediaItem.url) ||
      (!urlStatus.loading && !urlStatus.valid) ||
      urlStatus.isDuplicate
    const formValid = !hasUrlError && !hasCreditError && !urlStatus.loading
    setModalData(prev => ({ ...prev, formValid }))
  }, [formMediaItem, setModalData, urlStatus])

  const debouncedUpdateForm = useDebounce((updatedMediaItem, fieldIsModified, field) => {
    const updatedModifiedFields = { ...modifiedFields, [field]: fieldIsModified }
    setModifiedFields(updatedModifiedFields)

    const modified = Object.values(updatedModifiedFields).some(fieldIsModified => fieldIsModified)

    setModalData(prev => ({ ...prev, mediaItem: updatedMediaItem, modified }))
  }, 300)

  const handleUrlChange = newUrl => {
    const updatedMediaItem = {
      ...formMediaItem,
      url: newUrl,
    }

    setFormMediaItem(updatedMediaItem)

    const fieldIsModified =
      action === CONCEPT_STATE.MEDIA_ITEM.ADD
        ? updatedMediaItem.url !== EMPTY_MEDIA_ITEM.url
        : stagedState.media[mediaIndex].url !== updatedMediaItem.url

    setModifiedFields(prev => ({ ...prev, url: fieldIsModified }))
  }

  const handleUrlStatusChange = newUrlStatus => {
    setUrlStatus(newUrlStatus)
  }

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
  }

  const stageMedia = useStageMedia()
  const stageChange = event => {
    if (!urlStatus.loading && urlStatus.valid) {
      stageMedia(event)
    }
  }

  if (!mediaItem) {
    return null
  }

  const modalActionText = actionText === ACTION.EDIT ? MEDIA.EDIT.LABEL : MEDIA.ADD.LABEL

  const creditError = modifiedFields.credit && formMediaItem.credit.trim() === ''
  const creditHelperText = formMediaItem.credit.trim() === '' ? 'Credit cannot be empty' : ''

  return (
    <Box component='form' id={EDIT_MEDIA_FORM_ID} onSubmit={stageChange}>
      <ModalActionText text={modalActionText} />
      <EditMediaUrl
        formMediaItem={formMediaItem}
        modifiedUrl={modifiedFields.url}
        onUrlChange={handleUrlChange}
        onUrlStatusChange={handleUrlStatusChange}
        value={formMediaItem.url}
      />
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
      <EditMediaPrimary
        action={action}
        formMediaItem={formMediaItem}
        mediaIndex={mediaIndex}
        onChange={handleChange}
        stagedMedia={stagedState.media}
      />
      <MediaDisplay previewOn={previewOn} setPreviewOn={setPreviewOn} url={formMediaItem.url} />
    </Box>
  )
}

export default EditMediaContent
