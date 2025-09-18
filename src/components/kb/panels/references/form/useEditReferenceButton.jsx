import { use, useCallback, useMemo } from 'react'

import { useReferencesModalOperationsContext, useReferencesModalDataContext } from '@/contexts/panels/references/modal'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import Title from '@/components/common/factory/Title'
import Actions from '@/components/common/factory/Actions'

import { PROCESSING } from '@/lib/constants'
import {
  createModalActions,
  processEditReferenceData,
  createHandlers,
  createModalContent,
} from '@/components/kb/panels/references/form/referenceModalUtils'

const { UPDATING } = PROCESSING

const useEditReferenceButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } =
    useReferencesModalOperationsContext()
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

  const editReferenceModal = useCallback(
    referenceToEdit => {
      const modalReference = {
        ...referenceToEdit,
        concepts: referenceToEdit.concepts || [],
      }

      const ActionView = () => {
        const { modalData } = useReferencesModalDataContext()
        const actions = createModalActions(handleCancel, handleCommit)(modalData)
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
          original: referenceToEdit,
          isValid: true,
          hasChanges: false,
        },
      })
    },
    [createModal, handleFormChange, handleCancel, handleCommit]
  )

  return editReferenceModal
}

export default useEditReferenceButton
