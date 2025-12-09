import { Box, Stack, Typography } from '@mui/material'

import TemplateForm from '@/components/kb/panels/templates/form/TemplateForm'
import ModalActionText from '@/components/common/ModalActionText'

import { diff, filterObject, pick } from '@/lib/utils'

import { CONFIG } from '@/config/js/index.js'

const { CANCEL, DELETE, DISCARD, SAVE } = CONFIG.PANELS.TEMPLATES.MODALS.BUTTON

const TEMPLATE_FIELDS = ['concept', 'linkName', 'toConcept', 'linkValue']

const hasInput = (templateData, field) => templateData[field]?.trim() !== ''

export const createTemplateValidator = () => templateData =>
  TEMPLATE_FIELDS.every(field => hasInput(templateData, field))

const createChangeDetector =
  (isEdit = false) =>
    (templateData, original = null) => {
      if (!isEdit) {
        return TEMPLATE_FIELDS.some(field => hasInput(templateData, field))
      }

      if (!original) {
        return true
      }

      return TEMPLATE_FIELDS.some(field => templateData[field] !== original[field])
    }

const createFormChangeHandler = (updateModalData, isEdit = false) => {
  const validateTemplate = createTemplateValidator(isEdit)
  const calculateHasChanges = createChangeDetector(isEdit)

  return (updatedTemplate, original = null) => {
    const template = {
      ...updatedTemplate,
    }

    const isValid = validateTemplate(template)
    const hasChanges = calculateHasChanges(template, original)

    updateModalData({
      template,
      isValid,
      hasChanges,
      alert: null,
    })
  }
}

export const createModalActions =
  (handleCancel, handleCommit, updateModalData, saveLabel = SAVE) =>
    currentModalData => {
      const { confirmDiscard = false, hasChanges = false } = currentModalData || {}

      if (confirmDiscard) {
        return [
          {
            color: 'cancel',
            disabled: false,
            label: DISCARD,
            onClick: handleCancel,
          },
          {
            color: 'main',
            disabled: false,
            label: CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.CONTINUE,
            onClick: () => updateModalData({ confirmDiscard: false, alert: null }),
          },
        ]
      }

      return [
        {
          color: 'cancel',
          disabled: false,
          label: CANCEL,
          onClick: () =>
            hasChanges
              ? updateModalData({ confirmDiscard: true, alert: discardEditsAlert() })
              : handleCancel(),
        },
        {
          color: 'primary',
          disabled: !currentModalData.isValid || !currentModalData.hasChanges,
          label: saveLabel,
          onClick: () => handleCommit(currentModalData.template, currentModalData.original),
        },
      ]
    }

export const createModalContent = (handleFormChange, isEdit) => {
  const formKey = isEdit ? 'edit-template-form' : 'add-template-form'

  const TemplateModalContent = modalData => {
    return (
      <TemplateForm
        key={formKey}
        template={modalData.template}
        original={modalData.original}
        onChange={handleFormChange}
        isEdit={isEdit}
        alert={modalData.alert}
      />
    )
  }

  TemplateModalContent.displayName = 'TemplateModalContent'
  return TemplateModalContent
}

export const processEditTemplateData = (template, original) => {
  const hasFieldChanges = TEMPLATE_FIELDS.some(field => template[field] !== original[field])

  if (!hasFieldChanges) {
    return null
  }

  return filterObject(
    diff(pick(template, TEMPLATE_FIELDS), original),
    (_key, value) => value !== undefined && value !== null
  )
}

export const processAddTemplateData = template =>
  filterObject(pick(template, TEMPLATE_FIELDS), (_key, value) => value && value.trim() !== '')

export const createHandlers = (updateModalData, closeModal, isEdit) => {
  const handleCancel = () => closeModal(false)
  const handleFormChange = createFormChangeHandler(updateModalData, isEdit)

  return { handleCancel, handleFormChange }
}

export const createDeleteTemplateActions =
  (handleCancel, handleDeleteConfirm) => currentModalData => {
    return [
      {
        color: 'main',
        disabled: false,
        label: CANCEL,
        onClick: handleCancel,
      },
      {
        color: 'cancel',
        disabled: false,
        label: DELETE,
        onClick: () => handleDeleteConfirm(currentModalData.template),
      },
    ]
  }

export const createDeleteTemplateContent = () => {
  const DeleteTemplateContent = currentModalData => {
    const { template } = currentModalData
    const { CONTENT, FIELDS } = CONFIG.PANELS.TEMPLATES.MODALS.DELETE

    const fields = [
      { label: FIELDS.LINK_NAME, value: template.linkName },
      { label: FIELDS.TO_CONCEPT, value: template.toConcept },
      { label: FIELDS.LINK_VALUE, value: template.linkValue },
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
          <Typography variant='body1' color='cancel'>
            {CONTENT.WARNING.LINE_1}
          </Typography>
          <Typography variant='body1' color='cancel'>
            {CONTENT.WARNING.LINE_2}
          </Typography>
        </Stack>
      </Stack>
    )
  }

  DeleteTemplateContent.displayName = 'DeleteTemplateContent'
  return DeleteTemplateContent
}

export const createTemplateOnClose = updateModalData => data => {
  if (data?.hasChanges && !data?.confirmDiscard) {
    updateModalData({ confirmDiscard: true, alert: discardEditsAlert() })
    return false
  }
  return true
}

export const discardEditsAlert = () => ({
  line1: 'Discarding edits is final.',
  line2: 'Please confirm you want to discard the indicated edits.',
  severity: 'warning',
})

export const isDuplicateTemplate = (templates, template, excludeId = null) => {
  const list = Array.isArray(templates) ? templates : []
  return list.some(
    existing =>
      (excludeId ? existing.id !== excludeId : true) &&
      template.concept === existing.concept &&
      template.linkName === existing.linkName &&
      template.toConcept === existing.toConcept &&
      template.linkValue === existing.linkValue
  )
}

export const duplicateTemplateAlert = () => ({
  line1: 'A template with these values already exists for this concept.',
  line2: 'Please modify the values to create a unique template.',
  severity: 'error',
})
