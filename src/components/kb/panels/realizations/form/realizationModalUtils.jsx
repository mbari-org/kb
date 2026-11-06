import { use, useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Divider, Stack, TextField, Typography } from '@mui/material'

import RealizationForm from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/form/RealizationForm'
import RealizationTemplatesList from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/filter/RealizationTemplatesList'
import useAvailableLinkTemplates from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/useAvailableLinkTemplates'
import useFilterLinkName from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/useFilterLinkName'
import ActionsAlert from '@/components/modal/actions/ActionsAlert'
import ModalActionText from '@/components/common/ModalActionText'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import { EMPTY_REALIZATION, hasDuplicate, REALIZATION_FIELDS, REALIZATION_VALUE_FIELDS } from '@/lib/model/realization'
import { diff, filterObject, pick } from '@/lib/utils'

import CONFIG from '@/lib/config'

const { BUTTON } = CONFIG
const { ADD, EDIT, DELETE: DELETE_MODAL } = CONFIG.PANELS.REALIZATIONS.MODALS

const hasInput = (realizationData, field) => realizationData[field]?.trim() !== ''

export const createRealizationValidator = () => realizationData =>
  REALIZATION_VALUE_FIELDS.every(field => hasInput(realizationData, field))

const createChangeDetector = () => (realizationData, original) =>
  REALIZATION_VALUE_FIELDS.some(field => realizationData[field] !== original[field])

export const createFormChangeHandler = (updateModalData, isDuplicateCheck) => {
  const validateRealization = createRealizationValidator()
  const calculateHasChanges = createChangeDetector()

  return (updatedRealization, original) => {
    const realization = {
      ...updatedRealization,
    }

    updateModalData({
      realization,
      isValid: validateRealization(realization),
      hasChanges: calculateHasChanges(realization, original),
      isDuplicate: isDuplicateCheck(realization, original),
      confirmCommit: false,
      alert: null,
    })
  }
}

export const createModalActions =
  (handleCancel, handleCommit, updateModalData, saveLabel = BUTTON.SAVE) =>
  currentModalData => {
    const { confirmDiscard = false, hasChanges = false, isDuplicate = false } = currentModalData || {}

    if (confirmDiscard) {
      return [
        {
          color: 'cancel',
          disabled: false,
          label: BUTTON.DISCARD,
          onClick: handleCancel,
        },
        {
          color: 'main',
          disabled: false,
          label: BUTTON.CONTINUE,
          onClick: () => updateModalData({ confirmDiscard: false, alert: null }),
        },
      ]
    }

    return [
      {
        color: 'cancel',
        disabled: false,
        label: BUTTON.CANCEL,
        onClick: () =>
          hasChanges ? updateModalData({ confirmDiscard: true, alert: discardEditsAlert() }) : handleCancel(),
      },
      {
        color: 'primary',
        disabled:
          !currentModalData.isValid || !currentModalData.isValidToConcept || !currentModalData.hasChanges || isDuplicate,
        label: saveLabel,
        onClick: () => handleCommit(currentModalData.realization, currentModalData.original),
      },
    ]
  }

export const createEditContent = (handleFormChange, handleValidationChange, updateModalData) => {
  const EditRealizationContent = modalData => {
    const handleSubmit = event => {
      event.preventDefault()
      if (modalData.isValid && modalData.isValidToConcept && modalData.hasChanges && !modalData.isDuplicate) {
        updateModalData({ confirmCommit: true, alert: confirmRealizationSaveAlert() })
      }
    }

    return (
      <Stack spacing={2}>
        <ModalActionText text={EDIT.CONTENT.HEADER} />
        <RealizationForm
          conceptName={modalData.original.concept}
          isEdit
          onRealizationChange={item => handleFormChange(item, modalData.original)}
          onValidationChange={handleValidationChange}
          realizationItem={modalData.realization}
          stageChange={handleSubmit}
        />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: 60,
            justifyContent: 'center',
            pt: modalData.alert ? 0.5 : 0,
          }}
        >
          {modalData.alert ? (
            <ActionsAlert lines={modalData.alert.lines} severity={modalData.alert.severity || 'info'} />
          ) : null}
        </Box>
      </Stack>
    )
  }

  EditRealizationContent.displayName = 'EditRealizationContent'
  return EditRealizationContent
}

export const createAddContent = (handleFormChange, handleValidationChange, updateModalData) => {
  const AddRealizationContent = modalData => {
    const { isLoading } = use(PanelDataContext)

    const concept = modalData.realization.concept
    const getAvailableLinkTemplates = useAvailableLinkTemplates(concept)

    const [cycleIndex, setCycleIndex] = useState(0)
    const [filterLinkName, setFilterLinkName] = useState('')

    const filteredTemplates = useMemo(() => {
      return getAvailableLinkTemplates(filterLinkName)
    }, [getAvailableLinkTemplates, filterLinkName])

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setCycleIndex(0)
      }, 0)
      return () => clearTimeout(timeoutId)
    }, [filterLinkName])

    const handleRealizationChange = useCallback(
      updatedRealizationItem => handleFormChange(updatedRealizationItem, modalData.original),
      [modalData.original]
    )

    const handleTemplateSelect = useCallback(
      template =>
        handleFormChange(
          {
            ...modalData.realization,
            linkName: template.linkName,
            toConcept: template.toConcept,
            linkValue: template.linkValue,
            templateId: template.id,
          },
          modalData.original
        ),
      [modalData]
    )

    const { handleFilterKeyDown } = useFilterLinkName({
      cycleIndex,
      filterLinkName,
      filteredTemplates,
      onRealizationChange: handleRealizationChange,
      realizationItem: modalData.realization,
      setCycleIndex,
    })

    const handleSubmit = event => {
      event.preventDefault()
      if (modalData.isValid && modalData.isValidToConcept && modalData.hasChanges && !modalData.isDuplicate) {
        updateModalData({ confirmCommit: true, alert: confirmAddRealizationSaveAlert() })
      }
    }

    return (
      <Stack spacing={2}>
        <Box>
          <RealizationTemplatesList
            isLoading={isLoading}
            onTemplateSelect={handleTemplateSelect}
            templates={filteredTemplates}
          />
          <TextField
            fullWidth
            label='Filter by Link Name'
            onChange={event => {
              setFilterLinkName(event.target.value)
              handleRealizationChange({ ...EMPTY_REALIZATION, concept })
            }}
            onKeyDown={handleFilterKeyDown}
            size='small'
            sx={{ mb: 2, mt: 2 }}
            value={filterLinkName}
          />
          <Divider sx={{ my: 1 }} />
        </Box>
        <ModalActionText text={ADD.CONTENT.HEADER} />
        <RealizationForm
          conceptName={concept}
          onRealizationChange={handleRealizationChange}
          onValidationChange={handleValidationChange}
          realizationItem={modalData.realization}
          stageChange={handleSubmit}
        />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: 60,
            justifyContent: 'center',
            pt: modalData.alert ? 0.5 : 0,
          }}
        >
          {modalData.alert ? (
            <ActionsAlert lines={modalData.alert.lines} severity={modalData.alert.severity || 'info'} />
          ) : null}
        </Box>
      </Stack>
    )
  }

  AddRealizationContent.displayName = 'AddRealizationContent'
  return AddRealizationContent
}

export const processEditRealizationData = (realization, original) => {
  const hasFieldChanges = REALIZATION_VALUE_FIELDS.some(field => realization[field] !== original[field])

  if (!hasFieldChanges) {
    return null
  }

  return filterObject(
    diff(pick(realization, REALIZATION_VALUE_FIELDS), original),
    (_key, value) => value !== undefined && value !== null
  )
}

export const processAddRealizationData = realization =>
  filterObject(pick(realization, REALIZATION_FIELDS), (_key, value) => value && value.trim() !== '')

export const createHandlers = (updateModalData, closeModal, isDuplicateCheck) => {
  const handleCancel = () => closeModal(false)
  const handleFormChange = createFormChangeHandler(updateModalData, isDuplicateCheck)

  return { handleCancel, handleFormChange }
}

export const createDeleteRealizationActions = (handleCancel, handleDeleteConfirm) => currentModalData => {
  if (currentModalData.confirmDelete) {
    return [
      {
        color: 'main',
        disabled: false,
        label: BUTTON.CANCEL,
        onClick: handleCancel,
      },
      {
        color: 'cancel',
        disabled: false,
        label: BUTTON.DELETE,
        onClick: () => handleDeleteConfirm(currentModalData.realization),
      },
    ]
  }
  return [
    {
      color: 'main',
      disabled: false,
      label: BUTTON.CANCEL,
      onClick: handleCancel,
    },
    {
      color: 'cancel',
      disabled: false,
      label: BUTTON.DELETE,
      onClick: () => handleDeleteConfirm(currentModalData.realization),
    },
  ]
}

export const createDeleteRealizationContent = () => {
  const getSeverityColor = severity => {
    if (severity === 'error') return 'error.main'
    else if (severity === 'success') return 'success.main'
    else if (severity === 'info') return 'info.main'
    return 'warning.main'
  }
  const DeleteRealizationContent = currentModalData => {
    const { realization } = currentModalData
    const { ALERT, CONTENT, FIELDS } = DELETE_MODAL
    const warningLines = ALERT.WARNING.LINES
    const confirmLines = ALERT.CONFIRM_WARNING.LINES
    const showConfirmWarning = Boolean(currentModalData.confirmDelete)
    const linesToShow = showConfirmWarning ? confirmLines : warningLines
    const warningSeverity = showConfirmWarning ? ALERT.CONFIRM_WARNING.SEVERITY : ALERT.WARNING.SEVERITY
    const warningColor = getSeverityColor(warningSeverity)

    const fields = [
      { label: FIELDS.LINK_NAME, value: realization.linkName },
      { label: FIELDS.TO_CONCEPT, value: realization.toConcept },
      { label: FIELDS.LINK_VALUE, value: realization.linkValue },
    ]

    return (
      <Stack spacing={1}>
        <ModalActionText text={CONTENT.HEADER} />
        <Stack spacing={2} sx={{ p: 2 }}>
          {fields.map(({ label, value }) => (
            <Box key={label}>
              <Typography variant='subtitle2' color='text.secondary'>
                {label}
              </Typography>
              <Typography variant='body1'>{value}</Typography>
            </Box>
          ))}
        </Stack>
        <Stack sx={{ textAlign: 'center' }}>
          {linesToShow.map((line, index) => (
            <Typography key={`${line}-${index}`} variant='body1' color={warningColor}>
              {line}
            </Typography>
          ))}
        </Stack>
      </Stack>
    )
  }

  DeleteRealizationContent.displayName = 'DeleteRealizationContent'
  return DeleteRealizationContent
}

export const createRealizationOnClose = updateModalData => data => {
  if (data?.hasChanges && !data?.confirmDiscard) {
    updateModalData({ confirmDiscard: true, alert: discardEditsAlert() })
    return false
  }
  return true
}

export const discardEditsAlert = () => ({
  lines: EDIT.ALERT.DISCARD.LINES,
  severity: EDIT.ALERT.DISCARD.SEVERITY,
})

export const confirmRealizationSaveAlert = () => ({
  lines: EDIT.ALERT.SAVE_CONFIRM.LINES,
  severity: EDIT.ALERT.SAVE_CONFIRM.SEVERITY,
})

export const confirmRealizationDeleteAlert = () => ({
  lines: DELETE_MODAL.CONTENT.CONFIRM_WARNING,
  severity: DELETE_MODAL.ALERT.CONFIRM_WARNING.SEVERITY,
})

export const isDuplicateRealization = (realizations, realization, excludeId) =>
  hasDuplicate(
    realizations.filter(existing => existing.concept === realization.concept && existing.id !== excludeId),
    realization
  )

export const duplicateRealizationAlert = () => ({
  lines: EDIT.ALERT.DUPLICATE.LINES,
  severity: EDIT.ALERT.DUPLICATE.SEVERITY,
})

export const createAddRealizationOnClose = updateModalData => data => {
  if (data?.hasChanges && !data?.confirmDiscard) {
    updateModalData({ confirmDiscard: true, alert: discardAddRealizationAlert() })
    return false
  }
  return true
}

export const discardAddRealizationAlert = () => ({
  lines: ADD.ALERT.DISCARD.LINES,
  severity: ADD.ALERT.DISCARD.SEVERITY,
})

export const confirmAddRealizationSaveAlert = () => ({
  lines: ADD.ALERT.SAVE_CONFIRM.LINES,
  severity: ADD.ALERT.SAVE_CONFIRM.SEVERITY,
})

export const duplicateAddRealizationAlert = () => ({
  lines: ADD.ALERT.DUPLICATE.LINES,
  severity: ADD.ALERT.DUPLICATE.SEVERITY,
})
