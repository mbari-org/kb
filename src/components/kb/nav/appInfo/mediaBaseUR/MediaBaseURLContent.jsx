import { use, useCallback } from 'react'
import { Box, TextField } from '@mui/material'

import ActionsAlert from '@/components/modal/actions/ActionsAlert'

import AppModalContext from '@/contexts/app/AppModalContext'
import isValidUrl from '@/lib/validators/isValidUrl'
import useDebounce from '@/lib/hooks/useDebounce'

const URL_CHECK_DEBOUNCE_TIME = 500

const MediaBaseURLContent = () => {
  const { modalData, setModalData } = use(AppModalContext)
  const alert = modalData.alert || null
  const selectedMediaBaseUrl = modalData.selectedMediaBaseUrl || ''
  const trimmedMediaBaseUrl = selectedMediaBaseUrl.trim()
  const urlStatus = modalData.urlStatus || { loading: false, valid: true }

  const checkMediaBaseUrlExists = useCallback(async urlValue => {
    try {
      await fetch(urlValue, { method: 'GET', mode: 'no-cors' })
      return true
    } catch {
      return false
    }
  }, [])

  const debouncedUrlCheck = useDebounce(urlValue => {
    checkMediaBaseUrlExists(urlValue).then(exists => {
      setModalData(prev => {
        if ((prev.selectedMediaBaseUrl || '').trim() !== urlValue) {
          return prev
        }
        return {
          ...prev,
          urlStatus: { loading: false, valid: exists },
        }
      })
    })
  }, URL_CHECK_DEBOUNCE_TIME)

  const handleUrlInput = urlValue => {
    const trimmedUrlValue = urlValue.trim()
    if (trimmedUrlValue === '') {
      setModalData(prev => ({
        ...prev,
        alert: null,
        confirmCommit: false,
        selectedMediaBaseUrl: urlValue,
        urlStatus: { loading: false, valid: true },
      }))
      return
    }

    if (isValidUrl(trimmedUrlValue)) {
      setModalData(prev => ({
        ...prev,
        alert: null,
        confirmCommit: false,
        selectedMediaBaseUrl: urlValue,
        urlStatus: { loading: true, valid: true },
      }))
      debouncedUrlCheck(trimmedUrlValue)
      return
    }

    setModalData(prev => ({
      ...prev,
      alert: null,
      confirmCommit: false,
      selectedMediaBaseUrl: urlValue,
      urlStatus: { loading: false, valid: false },
    }))
  }

  const hasError =
    (trimmedMediaBaseUrl !== '' && !isValidUrl(trimmedMediaBaseUrl)) ||
    (!urlStatus.loading && !urlStatus.valid)

  const helperText =
    trimmedMediaBaseUrl === ''
      ? ' '
      : !isValidUrl(trimmedMediaBaseUrl)
        ? 'Please enter a valid URL'
        : urlStatus.loading
          ? 'Checking URL...'
          : !urlStatus.valid
            ? 'URL is not accessible'
            : ' '

  return (
    <Box sx={{ minWidth: 500, p: 1 }}>
      <TextField
        error={hasError}
        fullWidth
        helperText={helperText}
        label='Media Base URL'
        onChange={event => handleUrlInput(event.target.value)}
        placeholder='not set'
        size='small'
        value={selectedMediaBaseUrl}
      />
      <Box sx={{ alignItems: 'center', display: 'flex', height: 60, justifyContent: 'center', mt: 1 }}>
        {alert ? <ActionsAlert lines={alert.lines} severity={alert.severity || 'info'} /> : null}
      </Box>
    </Box>
  )
}

export default MediaBaseURLContent
