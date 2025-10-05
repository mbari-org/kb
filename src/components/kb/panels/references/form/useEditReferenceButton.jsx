import { use, useCallback, useMemo } from 'react'

import { useReferencesModalOperationsContext, useReferencesModalDataContext } from '@/contexts/panels/references/modal'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import Title from '@/components/common/factory/Title'
import Actions from '@/components/common/factory/Actions'
import useConfirmReferenceChangesModal from './useConfirmReferenceChangesModal'

import {
  createModalActions,
  processEditReferenceData,
  createHandlers,
  createModalContent,
  createChangeDetector,
} from '@/components/kb/panels/references/form/referenceModalUtils'

const useEditReferenceButton = () => {
  const { closeModal, createModal, updateModalData } =
    useReferencesModalOperationsContext()
  const { isDoiUnique } = use(PanelDataContext)
  const openConfirmModal = useConfirmReferenceChangesModal()

  const { handleCancel, handleFormChange } = useMemo(
    () => createHandlers(updateModalData, closeModal, true, isDoiUnique),
    [closeModal, isDoiUnique, updateModalData]
  )

  const handleCommit = useCallback(
    (reference, original, reopenEditModal) => {
      const updatedData = processEditReferenceData(reference, original)

      if (!updatedData) {
        closeModal()
        return
      }

      closeModal()
      openConfirmModal(reference, original, reopenEditModal)
    },
    [closeModal, openConfirmModal]
  )

  const editReferenceModal = useCallback(
    (referenceToEdit, databaseOriginal = null) => {
      const modalReference = {
        ...referenceToEdit,
        concepts: referenceToEdit.concepts || [],
      }
      
      const actualOriginal = databaseOriginal || referenceToEdit
      
      const calculateChanges = createChangeDetector(true)
      const initialHasChanges = calculateChanges(modalReference, actualOriginal)

      const reopenThisModal = updatedRef => {
        const refToUse = updatedRef || referenceToEdit
        editReferenceModal(refToUse, actualOriginal)
      }

      const ActionView = () => {
        const { modalData } = useReferencesModalDataContext()
        const handleCommitWithReopen = (ref, orig) => handleCommit(ref, orig, reopenThisModal)
        const actions = createModalActions(handleCancel, handleCommitWithReopen)(modalData)
        if (!Array.isArray(actions)) return null

        const colors = actions.map(a => a.color || 'main')
        const disabled = actions.map(a => a.disabled || false)
        const labels = actions.map(a => a.label)

        const onAction = label => {
          const a = actions.find(x => x.label === label)
          if (a && a.onClick) a.onClick()
        }

        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const ContentView = () => {
        const { modalData } = useReferencesModalDataContext()
        const ReferenceModalContent = createModalContent(handleFormChange, true)
        return ReferenceModalContent(modalData)
      }

      const TitleView = () => <Title title='Edit Reference' />

      createModal({
        actionsComponent: ActionView,
        contentComponent: ContentView,
        titleComponent: TitleView,
        data: {
          reference: modalReference,
          original: actualOriginal,
          isValid: true,
          hasChanges: initialHasChanges,
        },
      })
    },
    [createModal, handleFormChange, handleCancel, handleCommit]
  )

  return editReferenceModal
}

export default useEditReferenceButton
