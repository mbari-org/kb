import { use } from 'react'

import { createActions } from '@/components/common/factory/createComponent'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'

import isValidUrl from '@/lib/validators/isValidUrl'
import CONFIG from '@/text'

const { CANCEL, SAVE } = CONFIG.PANELS.CONCEPTS.BUTTON

const BaseURLActions = ({
  actionName,
  currentBaseUrl = '',
  invalidUrlAlert,
  modalDataValueKey,
  preferenceKey,
  saveConfirmAlert,
}) => {
  const { closeModal, modalData, setModalData } = use(AppModalContext)
  const { saveAppPreference } = use(ConfigContext)
  const confirmCommit = Boolean(modalData.confirmCommit)
  const selectedBaseUrl = modalData[modalDataValueKey] || ''
  const trimmedBaseUrl = selectedBaseUrl.trim()
  const isEmptyBaseUrl = trimmedBaseUrl === ''
  const isValidBaseUrl = isEmptyBaseUrl || isValidUrl(trimmedBaseUrl)
  const urlStatus = modalData.urlStatus || { loading: false, valid: isValidBaseUrl }
  const isCurrentBaseUrl = trimmedBaseUrl === currentBaseUrl

  const colors = ['cancel', 'main']
  const disabled = [false, !isValidBaseUrl || (!isEmptyBaseUrl && (urlStatus.loading || !urlStatus.valid)) || isCurrentBaseUrl]
  const labels = [CANCEL, SAVE]

  const onAction = async label => {
    switch (label) {
      case CANCEL:
        closeModal(false)
        break

      case SAVE:
        if (!isValidBaseUrl || (!isEmptyBaseUrl && (urlStatus.loading || !urlStatus.valid))) {
          setModalData(prev => ({
            ...prev,
            confirmCommit: false,
            alert: {
              lines: invalidUrlAlert.LINES,
              severity: invalidUrlAlert.SEVERITY,
            },
          }))
          break
        }

        if (!confirmCommit) {
          setModalData(prev => ({
            ...prev,
            confirmCommit: true,
            alert: {
              lines: saveConfirmAlert.LINES,
              severity: saveConfirmAlert.SEVERITY,
            },
          }))
          break
        }

        await saveAppPreference(preferenceKey, trimmedBaseUrl)
        closeModal(true)
        break

      default:
        throw new Error(`Invalid ${actionName} action: ${label}`)
    }
  }

  return createActions({ colors, disabled, labels, onAction }, `${actionName}Actions`)
}

export default BaseURLActions
