import { Box, Stack, Typography } from '@mui/material'

import ReferenceForm from '@/components/kb/panels/references/form/ReferenceForm'

import CONFIG from '@/text'
import { diff, filterObject, pick } from '@/lib/utils'

const { CANCEL, DELETE, DISCARD_ALL, SAVE } = CONFIG.PANELS.REFERENCES.MODALS.BUTTON
const { CONCEPT } = CONFIG

export const REFERENCE_FIELDS = {
  ADD_SUBMIT: ['citation', 'doi', 'concepts'],
  EDITABLE: ['citation', 'doi', 'concepts'],
  REQUIRED_ADD: ['citation', 'doi'],
  REQUIRED_BASE: ['citation', 'doi'],
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
      hasChanges,
      isValid,
      reference,
    })
  }
}

export const createModalActions =
  (handleCancel, handleCommit, saveLabel = SAVE) =>
    currentModalData => {
      const { isValid, hasChanges, confirmDiscard } = currentModalData

      if (confirmDiscard) {
        return [
          {
            color: 'cancel',
            disabled: false,
            label: DISCARD_ALL,
            onClick: handleCancel,
          },
          {
            color: 'main',
            disabled: false,
            label: CONFIG.PANELS.REFERENCES.MODALS.BUTTON.CONTINUE,
            onClick: handleCancel,
          },
        ]
      }

      return [
        {
          color: 'cancel',
          disabled: false,
          label: isValid && hasChanges ? CONFIG.PANELS.REFERENCES.MODALS.BUTTON.DISCARD : CANCEL,
          onClick: handleCancel,
        },
        {
          color: 'primary',
          disabled: !isValid || !hasChanges,
          label: saveLabel,
          onClick: () => handleCommit(currentModalData.reference, currentModalData.original),
        },
      ]
    }

export const createModalContent = (handleFormChange, isEdit) => {
  const formKey = isEdit ? 'edit-reference-form' : 'add-reference-form'

  const ReferenceModalContent = modalData => {
    return (
      <ReferenceForm
        key={formKey}
        isEdit={isEdit}
        onChange={handleFormChange}
        original={modalData.original}
        reference={modalData.reference}
      />
    )
  }

  ReferenceModalContent.displayName = 'ReferenceModalContent'
  return ReferenceModalContent
}

export const createInitialReference = initialConcept => ({
  citation: '',
  doi: '',
  concepts: initialConcept ? [initialConcept] : [],
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
    return null
  }

  return filterObject(
    diff(pick(reference, REFERENCE_FIELDS.EDITABLE), original),
    (_key, value) => value !== undefined && value !== null
  )
}

export const processAddReferenceData = reference => {
  const data = pick(reference, REFERENCE_FIELDS.ADD_SUBMIT)

  // API requires concepts array (even if empty)
  return {
    ...filterObject(data, (key, value) => {
      if (key === 'concepts') {
        return true
      }
      return value && value.trim() !== ''
    }),
    concepts: data.concepts || [],
  }
}

export const createHandlers = (updateModalData, closeModal, isEdit, isDoiUnique = () => true) => {
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

export const createDeleteReferenceContent = () => {
  const DeleteReferenceContent = currentModalData => {
    const { reference } = currentModalData
    const { CONTENT, FIELDS } = CONFIG.PANELS.REFERENCES.MODALS.DELETE
    const warningLines = CONTENT.WARNING ?? []

    const fields = [
      { label: FIELDS.CITATION, value: reference.citation },
      { label: FIELDS.DOI, value: reference.doi },
      { label: FIELDS.CONCEPTS, value: reference.concepts ? reference.concepts.join(', ') : CONCEPT.NO_ITEMS },
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
          {warningLines.map((line, index) => (
            <Typography key={`${line}-${index}`} variant='body1' color='text.secondary'>
              {line}
            </Typography>
          ))}
        </Stack>
      </Stack>
    )
  }

  DeleteReferenceContent.displayName = 'DeleteReferenceContent'
  return DeleteReferenceContent
}
