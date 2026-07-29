import { use, useCallback } from 'react'
import { TextField } from '@mui/material'
import AppInfoEditLayout from '@/components/kb/nav/appInfo/AppInfoEditLayout'

import AppModalContext from '@/contexts/app/AppModalContext'

import isValidUrl from '@/lib/validators/isValidUrl'
import useDebounce from '@/lib/hooks/useDebounce'

const URL_CHECK_DEBOUNCE_TIME = 500
const BaseURLContent = ({ description, fieldLabel, modalDataValueKey }) => {
  const { modalData, setModalData } = use(AppModalContext)
  const alert = modalData.alert || null
  const selectedBaseUrl = modalData[modalDataValueKey] || ''
  const trimmedBaseUrl = selectedBaseUrl.trim()
  const urlStatus = modalData.urlStatus || { loading: false, valid: true }

  const checkBaseUrlExists = useCallback(async urlValue => {
    try {
      await fetch(urlValue, { method: 'GET', mode: 'no-cors' })
      return true
    } catch {
      return false
    }
  }, [])

  const debouncedUrlCheck = useDebounce(urlValue => {
    checkBaseUrlExists(urlValue).then(exists => {
      setModalData(prev => {
        if ((prev[modalDataValueKey] || '').trim() !== urlValue) {
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
        [modalDataValueKey]: urlValue,
        urlStatus: { loading: false, valid: true },
      }))
      return
    }

    if (isValidUrl(trimmedUrlValue)) {
      setModalData(prev => ({
        ...prev,
        alert: null,
        confirmCommit: false,
        [modalDataValueKey]: urlValue,
        urlStatus: { loading: true, valid: true },
      }))
      debouncedUrlCheck(trimmedUrlValue)
      return
    }

    setModalData(prev => ({
      ...prev,
      alert: null,
      confirmCommit: false,
      [modalDataValueKey]: urlValue,
      urlStatus: { loading: false, valid: false },
    }))
  }

  const hasError = (trimmedBaseUrl !== '' && !isValidUrl(trimmedBaseUrl)) || (!urlStatus.loading && !urlStatus.valid)

  const fieldHelperText =
    trimmedBaseUrl !== '' && !isValidUrl(trimmedBaseUrl)
      ? 'Please enter a valid URL'
      : urlStatus.loading
        ? 'Checking URL...'
        : !urlStatus.valid
          ? 'URL is not accessible'
          : ' '

  return (
    <AppInfoEditLayout alert={alert} description={description}>
      <TextField
        error={hasError}
        fullWidth
        helperText={fieldHelperText}
        label={fieldLabel}
        onChange={e => handleUrlInput(e.target.value)}
        size='small'
        value={selectedBaseUrl}
      />
    </AppInfoEditLayout>
  )
}

export default BaseURLContent
