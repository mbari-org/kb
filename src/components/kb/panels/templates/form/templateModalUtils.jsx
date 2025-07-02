import { Box, Stack, Typography } from '@mui/material'

import TemplateForm from '@/components/kb/panels/templates/form/TemplateForm'

import { LABELS } from '@/lib/constants'

import { diff, filterObject, pick } from '@/lib/utils'

const { CANCEL, SAVE, DELETE } = LABELS.BUTTON

const TEMPLATE_FIELDS = ['concept', 'linkName', 'toConcept', 'linkValue']

export const createTemplateValidator =
  (isEdit = false) =>
  templateData => {
    const requiredFields = TEMPLATE_FIELDS

    const allFieldsFilled = requiredFields.every(field => {
      const value = templateData[field] || ''
      return value.trim() !== ''
    })

    return allFieldsFilled
  }

const createChangeDetector =
  (isEdit = false) =>
  (templateData, original = null) => {
    if (!isEdit) {
      // For add mode, any non-empty field means changes
      const fieldsToCheck = TEMPLATE_FIELDS
      return fieldsToCheck.some(field => {
        const value = templateData[field] || ''
        return value.trim() !== ''
      })
    }

    // For edit mode, compare with original
    if (!original) {
      // If no original template, consider any data as changes
      return true
    }

    const fieldsToCompare = TEMPLATE_FIELDS
    return fieldsToCompare.some(field => templateData[field] !== original[field])
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
    })
  }
}

export const createModalActions =
  (handleCancel, handleCommit, saveLabel = SAVE) =>
  currentModalData =>
    [
      {
        color: 'cancel',
        disabled: false,
        label: CANCEL,
        onClick: handleCancel,
      },
      {
        color: 'primary',
        disabled: !currentModalData.isValid || !currentModalData.hasChanges,
        label: saveLabel,
        onClick: () => handleCommit(currentModalData.template, currentModalData.original),
      },
    ]

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
      />
    )
  }

  TemplateModalContent.displayName = 'TemplateModalContent'
  return TemplateModalContent
}

export const createInitialTemplate = () => ({
  concept: '',
  linkName: '',
  toConcept: '',
  linkValue: '',
})

export const processEditTemplateData = (template, original) => {
  const hasFieldChanges = TEMPLATE_FIELDS.some(field => template[field] !== original[field])

  if (!hasFieldChanges) {
    return null // No changes
  }

  // Get updates
  return filterObject(
    diff(pick(template, TEMPLATE_FIELDS), original),
    (key, value) => value !== undefined && value !== null
  )
}

export const processAddTemplateData = template => {
  return filterObject(pick(template, TEMPLATE_FIELDS), (key, value) => value && value.trim() !== '')
}

export const createHandlers = (updateModalData, closeModal, isEdit) => {
  // Create the form change handler once, not on every form change
  const formChangeHandler = createFormChangeHandler(updateModalData, isEdit)

  const handleFormChange = (updatedTemplate, original) => {
    return formChangeHandler(updatedTemplate, original)
  }

  const handleCancel = () => {
    closeModal()
  }

  return { handleCancel, handleFormChange }
}

// Delete template specific utilities
export const createDeleteTemplateActions =
  (handleCancel, handleDeleteConfirm) => currentModalData => {
    return [
      {
        color: 'cancel',
        disabled: false,
        label: CANCEL,
        onClick: handleCancel,
      },
      {
        color: 'error',
        disabled: false,
        label: DELETE,
        onClick: () => handleDeleteConfirm(currentModalData.template),
      },
    ]
  }

export const createDeleteTemplateTitle = () => 'Delete Template'

export const createDeleteTemplateContent = () => {
  const DeleteTemplateContent = currentModalData => {
    const { template } = currentModalData

    const fields = [
      { label: 'Concept', value: template.concept },
      { label: 'Link Name', value: template.linkName },
      { label: 'To Concept', value: template.toConcept },
      { label: 'Link Value', value: template.linkValue },
    ]

    return (
      <Stack spacing={3}>
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
        <Stack spacing={0} sx={{ textAlign: 'center' }}>
          <Typography variant='body1' color='text.secondary'>
            This template will be permanently deleted.
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            This action cannot be undone.
          </Typography>
        </Stack>
      </Stack>
    )
  }

  DeleteTemplateContent.displayName = 'DeleteTemplateContent'
  return DeleteTemplateContent
}
