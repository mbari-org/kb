import { use, useCallback, useMemo } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'
import { createError, createValidationError } from '@/lib/errors'

import { useReferencesModalOperationsContext, useReferencesModalDataContext } from '@/contexts/panels/references/modal'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import Title from '@/components/common/factory/Title'
import Actions from '@/components/common/factory/Actions'

import { LABELS, PROCESSING } from '@/lib/constants'
import {
  createModalActions,
  createReferenceValidator,
  createInitialReference,
  processAddReferenceData,
  createHandlers,
  createModalContent,
} from '@/components/kb/panels/references/modal/referenceModalUtils'

const { SAVING } = PROCESSING
const { CONFIRM_DISCARD, DISCARD } = LABELS.BUTTON

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
          throw createValidationError('Invalid reference data', {
            doi: reference.doi,
            citation: reference.citation,
            concepts: reference.concepts,
          })
        }

        setProcessing(SAVING)

        const referenceData = processAddReferenceData(reference)
        await addReference(referenceData)
        closeModal()
      } catch (error) {
        setProcessing(false)
        if (error.title === 'Validation Error') {
          throw error
        }
        throw createError(
          'Reference Creation Error',
          'Failed to create new reference',
          { referenceData: reference },
          error
        )
      }
    },
    [addReference, closeModal, setProcessing, isDoiUnique]
  )

  const addReferenceModal = useCallback(() => {
    const ActionView = () => {
      const { modalData } = useReferencesModalDataContext()

      const confirmDiscard = !!modalData?.confirmDiscard

      if (confirmDiscard) {
        const colors = ['cancel', 'main']
        const disabled = [false, false]
        const labels = [DISCARD, 'Continue']

        const onAction = label => {
          if (label === DISCARD) {
            closeModal()
          } else {
            updateModalData({ confirmDiscard: false })
          }
        }

        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const actions = createModalActions(handleCancel, handleCommit)(modalData)
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
        if (label === DISCARD || label === CONFIRM_DISCARD) {
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
      const ReferenceModalContent = createModalContent(handleFormChange, false)
      return ReferenceModalContent(modalData)
    }

    const TitleView = () => <Title title='Add Reference' />

    createModal({
      actionsComponent: ActionView,
      contentComponent: ContentView,
      titleComponent: TitleView,
      data: {
        reference: createInitialReference(),
        isValid: false,
        hasChanges: false,
      },
      onClose: currentData => {
        const { confirmDiscard, hasChanges } = currentData || {}
        if (!confirmDiscard && hasChanges) {
          updateModalData({ confirmDiscard: true })
          return false
        }
        return true
      },
    })
  }, [createModal, handleFormChange, handleCancel, handleCommit, closeModal, updateModalData])

  const AddReferenceButton = useCallback(
    () => <PanelAddButton onClick={addReferenceModal} />,
    [addReferenceModal]
  )

  return AddReferenceButton
}

export default useAddReferenceButton
