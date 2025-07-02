import { use, useCallback, useMemo } from 'react'

import { useReferencesModalOperationsContext } from '@/contexts/panels/references/modal'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import PanelDataContext from '@/contexts/panels/PanelDataContext'

import { PROCESSING } from '@/lib/constants'
import {
  createModalActions,
  processEditReferenceData,
  createHandlers,
  createModalContent,
} from '@/components/kb/panels/references/form/referenceModalUtils'

const { UPDATING } = PROCESSING

const useEditReferenceButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } = useReferencesModalOperationsContext()
  const { editReference } = use(ReferencesContext)
  const { isDoiUnique } = use(PanelDataContext)

  const { handleCancel, handleFormChange } = useMemo(
    () => createHandlers(updateModalData, closeModal, true, isDoiUnique),
    [updateModalData, closeModal, isDoiUnique]
  )

  const handleCommit = useCallback(
    async (reference, original) => {
      try {
        const updatedData = processEditReferenceData(reference, original)

        if (!updatedData) {
          closeModal()
          return
        }

        setProcessing(UPDATING)
        await editReference(original, reference)
        closeModal()
      } catch (error) {
        setProcessing(false)
        throw error
      }
    },
    [editReference, closeModal, setProcessing]
  )

  const content = useCallback(
    currentModalData => createModalContent(handleFormChange, true)(currentModalData),
    [handleFormChange]
  )

  const editReferenceModal = useCallback(
    referenceToEdit => {
      const modalReference = {
        ...referenceToEdit,
        concepts: referenceToEdit.concepts || [],
      }

      createModal({
        actions: createModalActions(handleCancel, handleCommit),
        content,
        title: 'Edit Reference',
        data: {
          reference: modalReference,
          original: referenceToEdit,
          isValid: true,
          hasChanges: false,
        },
      })
    },
    [createModal, content, handleCancel, handleCommit]
  )

  return editReferenceModal
}

export default useEditReferenceButton
