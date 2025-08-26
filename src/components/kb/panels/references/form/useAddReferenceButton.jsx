import { use, useCallback, useMemo } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'

import { useReferencesModalOperationsContext } from '@/contexts/panels/references/modal'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import Title from '@/components/common/factory/Title'

import { PROCESSING } from '@/lib/constants'
import {
  createModalActions,
  createReferenceValidator,
  createInitialReference,
  processAddReferenceData,
  createHandlers,
  createModalContent,
} from '@/components/kb/panels/references/form/referenceModalUtils'

const { SAVING } = PROCESSING

const useAddReferenceButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } =
    useReferencesModalOperationsContext()
  const { addReference } = use(ReferencesContext)
  const { isDoiUnique } = use(PanelDataContext)

  const { handleCancel, handleFormChange } = useMemo(
    () => createHandlers(updateModalData, closeModal, false, isDoiUnique),
    [updateModalData, closeModal, isDoiUnique]
  )

  const handleCommit = useCallback(
    async reference => {
      try {
        const validateReference = createReferenceValidator(false, isDoiUnique)
        if (!validateReference(reference)) {
          return
        }

        setProcessing(SAVING)

        const referenceData = processAddReferenceData(reference)
        await addReference(referenceData)
        closeModal()
      } catch (error) {
        setProcessing(false)
        throw error
      }
    },
    [addReference, closeModal, setProcessing, isDoiUnique]
  )

  const content = useCallback(
    currentModalData => createModalContent(handleFormChange, false)(currentModalData),
    [handleFormChange]
  )

  const addReferenceModal = useCallback(() => {
    createModal({
      actions: createModalActions(handleCancel, handleCommit),
      content,
      titleComponent: () => <Title title='Add Reference' />,
      data: {
        reference: createInitialReference(),
        isValid: false,
        hasChanges: false,
      },
    })
  }, [createModal, content, handleCancel, handleCommit])

  const AddReferenceButton = useCallback(
    () => <PanelAddButton onClick={addReferenceModal} />,
    [addReferenceModal]
  )

  return AddReferenceButton
}

export default useAddReferenceButton
