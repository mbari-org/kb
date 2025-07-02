import { Box, Stack, Typography } from '@mui/material'

import ReferenceForm from '@/components/kb/panels/references/form/ReferenceForm'

import { LABELS } from '@/lib/constants'

import { diff, filterObject, pick } from '@/lib/utils'

const { CANCEL, SAVE, DELETE } = LABELS.BUTTON

export const REFERENCE_FIELDS = {
  EDITABLE: ['citation', 'doi', 'concepts'],
  REQUIRED_BASE: ['citation', 'doi'],
  REQUIRED_ADD: ['citation', 'doi'],
  ADD_SUBMIT: ['citation', 'doi', 'concepts'],
}

export const createReferenceValidator =
  (isEdit = false, isDoiUnique = () => true) =>
  referenceData => {
    const requiredFields = isEdit ? REFERENCE_FIELDS.REQUIRED_BASE : REFERENCE_FIELDS.REQUIRED_ADD

    const allFieldsFilled = requiredFields.every(field => {
      const value = referenceData[field] || ''
      return value.trim() !== ''
    })

    const isDoiValid = isDoiUnique(referenceData.doi, referenceData.id)

    return allFieldsFilled && isDoiValid
  }

export const createChangeDetector =
  (isEdit = false) =>
  (referenceData, original = null) => {
    if (!isEdit) {
      // For add mode, any non-empty field means changes
      const fieldsToCheck = REFERENCE_FIELDS.REQUIRED_ADD
      return (
        fieldsToCheck.some(field => {
          const value = referenceData[field] || ''
          return value.trim() !== ''
        }) ||
        (referenceData.concepts && referenceData.concepts.length > 0)
      )
    }

    // For edit mode, compare with original
    if (!original) {
      // If no original reference, consider any data as changes
      return true
    }

    const fieldsToCompare = REFERENCE_FIELDS.EDITABLE
    return fieldsToCompare.some(field => {
      if (field === 'concepts') {
        // Compare arrays
        const originalConcepts = original[field] || []
        const currentConcepts = referenceData[field] || []
        return JSON.stringify(originalConcepts.sort()) !== JSON.stringify(currentConcepts.sort())
      }
      return referenceData[field] !== original[field]
    })
  }

export const createFormChangeHandler = (
  updateModalData,
  isEdit = false,
  isDoiUnique = () => true
) => {
  const validateReference = createReferenceValidator(isEdit, isDoiUnique)
  const calculateHasChanges = createChangeDetector(isEdit)

  return (updatedReference, original = null) => {
    const reference = {
      ...updatedReference,
      concepts: updatedReference.concepts || [],
    }

    const isValid = validateReference(reference)
    const hasChanges = calculateHasChanges(reference, original)

    updateModalData({
      reference,
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
        onClick: () => handleCommit(currentModalData.reference, currentModalData.original),
      },
    ]

export const createModalContent = (handleFormChange, isEdit) => {
  const formKey = isEdit ? 'edit-reference-form' : 'add-reference-form'

  const ReferenceModalContent = modalData => {
    return (
      <ReferenceForm
        key={formKey}
        reference={modalData.reference}
        original={modalData.original}
        onChange={handleFormChange}
        isEdit={isEdit}
      />
    )
  }

  ReferenceModalContent.displayName = 'ReferenceModalContent'
  return ReferenceModalContent
}

export const createInitialReference = () => ({
  citation: '',
  doi: '',
  concepts: [],
})

export const processEditReferenceData = (reference, original) => {
  const hasFieldChanges = REFERENCE_FIELDS.EDITABLE.some(field => {
    if (field === 'concepts') {
      const originalConcepts = original[field] || []
      const currentConcepts = reference[field] || []
      return JSON.stringify(originalConcepts.sort()) !== JSON.stringify(currentConcepts.sort())
    }
    return reference[field] !== original[field]
  })

  if (!hasFieldChanges) {
    return null // No changes
  }

  // Get updates
  return filterObject(
    diff(pick(reference, REFERENCE_FIELDS.EDITABLE), original),
    (_key, value) => value !== undefined && value !== null
  )
}

export const processAddReferenceData = reference => {
  const data = pick(reference, REFERENCE_FIELDS.ADD_SUBMIT)

  // Always include concepts array (even if empty) as required by API
  return {
    ...filterObject(data, (key, value) => {
      if (key === 'concepts') {
        return true // Always include concepts
      }
      return value && value.trim() !== ''
    }),
    concepts: data.concepts || [], // Ensure concepts is always an array
  }
}

export const createHandlers = (updateModalData, closeModal, isEdit, isDoiUnique = () => true) => {
  // Create the form change handler once, not on every form change
  const formChangeHandler = createFormChangeHandler(updateModalData, isEdit, isDoiUnique)

  const handleFormChange = (updatedReference, original) => {
    return formChangeHandler(updatedReference, original)
  }

  const handleCancel = () => {
    closeModal()
  }

  return { handleCancel, handleFormChange }
}

export const createDeleteReferenceActions =
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
        onClick: () => handleDeleteConfirm(currentModalData.reference),
      },
    ]
  }

export const createDeleteReferenceTitle = () => 'Delete Reference'

export const createDeleteReferenceContent = () => {
  const DeleteReferenceContent = currentModalData => {
    const { reference } = currentModalData

    const fields = [
      { label: 'Citation', value: reference.citation },
      { label: 'DOI', value: reference.doi },
      { label: 'Concepts', value: reference.concepts ? reference.concepts.join(', ') : 'None' },
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
            This reference will be permanently deleted.
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            This action cannot be undone.
          </Typography>
        </Stack>
      </Stack>
    )
  }

  DeleteReferenceContent.displayName = 'DeleteReferenceContent'
  return DeleteReferenceContent
}
