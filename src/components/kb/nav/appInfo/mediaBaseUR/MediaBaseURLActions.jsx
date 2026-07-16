import { use } from 'react'

import { createActions } from '@/components/common/factory/createComponent'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import isValidUrl from '@/lib/validators/isValidUrl'
import { PREFS } from '@/lib/constants/prefs.js'
import CONFIG from '@/text'

const mediaBaseUrlKey = PREFS.APP.MEDIA.BASE_URL.ROOT.KEY
const { CANCEL, SAVE } = CONFIG.PANELS.CONCEPTS.BUTTON
const { INVALID_URL, SAVE_CONFIRM } = CONFIG.PANELS.ABOUT_HELP.MEDIA_BASE_URL.ALERT

const MediaBaseURLActions = () => {
  const { closeModal, modalData, setModalData } = use(AppModalContext)
  const { mediaBaseUrl, saveAppPreference } = use(ConfigContext)
  const confirmCommit = Boolean(modalData.confirmCommit)
  const selectedMediaBaseUrl = modalData.selectedMediaBaseUrl || ''
  const trimmedMediaBaseUrl = selectedMediaBaseUrl.trim()
  const isEmptyMediaBaseUrl = trimmedMediaBaseUrl === ''
  const isValidMediaBaseUrl = isEmptyMediaBaseUrl || isValidUrl(trimmedMediaBaseUrl)
  const urlStatus = modalData.urlStatus || { loading: false, valid: isValidMediaBaseUrl }
  const isCurrentMediaBaseUrl = trimmedMediaBaseUrl === mediaBaseUrl

  const colors = ['cancel', 'main']
  const disabled = [
    false,
    !isValidMediaBaseUrl ||
      (!isEmptyMediaBaseUrl && (urlStatus.loading || !urlStatus.valid)) ||
      isCurrentMediaBaseUrl,
  ]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal(false)
        break

      case SAVE:
        if (
          !isValidMediaBaseUrl ||
          (!isEmptyMediaBaseUrl && (urlStatus.loading || !urlStatus.valid))
        ) {
          setModalData(prev => ({
            ...prev,
            confirmCommit: false,
            alert: {
              lines: INVALID_URL.LINES,
              severity: INVALID_URL.SEVERITY,
            },
          }))
          break
        }

        if (!confirmCommit) {
          setModalData(prev => ({
            ...prev,
            confirmCommit: true,
            alert: {
              lines: SAVE_CONFIRM.LINES,
              severity: SAVE_CONFIRM.SEVERITY,
            },
          }))
          break
        }

        await saveAppPreference(mediaBaseUrlKey, trimmedMediaBaseUrl)
        closeModal(true)
        break

      default:
        throw new Error(`Invalid media base URL action: ${label}`)
    }
  }

  return createActions({ colors, disabled, labels, onAction }, 'MediaBaseURLActions')
}

export default MediaBaseURLActions
