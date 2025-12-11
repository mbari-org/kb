import { use, useCallback, useMemo } from 'react'

import { useReferencesModalOperationsContext, useReferencesModalDataContext } from '@/contexts/panels/references/modal'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import Title from '@/components/common/factory/Title'
import Actions from '@/components/common/factory/Actions'
import useConfirmReferenceModal from '@/components/kb/panels/references/modal/useConfirmReferenceModal'

import CONFIG from '@/text'
import {
  createChangeDetector,
  createHandlers,
  createModalActions,
  createModalContent,
  processEditReferenceData,
} from '@/components/kb/panels/references/modal/referenceModalUtils'

const { DISCARD } = CONFIG.PANELS.REFERENCES.MODALS.BUTTON

const useEditReferenceButton = () => {
  const openConfirmModal = useConfirmReferenceModal()
  const { closeModal, createModal, updateModalData } =
    useReferencesModalOperationsContext()
  const { isDoiUnique } = use(PanelDataContext)

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

        const confirmDiscard = !!modalData?.confirmDiscard

        if (confirmDiscard) {
          const colors = ['cancel', 'main']
          const disabled = [false, false]
          const labels = [DISCARD, CONFIG.PANELS.REFERENCES.MODALS.BUTTON.CONTINUE]

          const onAction = label => {
            if (label === DISCARD) {
              closeModal()
            } else {
              updateModalData({ confirmDiscard: false })
            }
          }

          return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
        }

        const actions = createModalActions(handleCancel, handleCommitWithReopen)(modalData)
        if (!Array.isArray(actions)) return null

        const colors = actions.map(a => a.color || 'main')
        const disabled = actions.map(a => a.disabled || false)
        const labels = actions.map((a, i) => {
          if (i === 0 && modalData?.hasChanges) {
            return DISCARD
          }
          return a.label
        })

        const onAction = label => {
          if (label === DISCARD || label === CONFIG.PANELS.REFERENCES.MODALS.BUTTON.DISCARD) {
            updateModalData({ confirmDiscard: true })
            return
          }
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

      const TitleView = () => <Title title={CONFIG.PANELS.REFERENCES.MODALS.EDIT.TITLE} />

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
        onClose: currentData => {
          const { confirmDiscard, hasChanges } = currentData || {}
          if (!confirmDiscard && hasChanges) {
            // Enter confirm-discard mode instead of closing
            updateModalData({ confirmDiscard: true })
            return false
          }
          // Otherwise allow closing
          return true
        },
      })
    },
    [createModal, handleFormChange, handleCancel, handleCommit, closeModal, updateModalData]
  )

  return editReferenceModal
}

export default useEditReferenceButton
