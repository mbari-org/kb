import { use, useCallback, useMemo } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'
import Actions from '@/components/common/factory/Actions'
import Title from '@/components/common/factory/Title'
import { createError, createValidationError } from '@/lib/errors'

import { useReferencesModalOperationsContext, useReferencesModalDataContext } from '@/contexts/panels/references/modal'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { LABELS, PROCESSING, SELECTED } from '@/lib/constants'
import {
  createHandlers,
  createInitialReference,
  createModalActions,
  createModalContent,
  createReferenceValidator,
  processAddReferenceData,
} from '@/components/kb/panels/references/modal/referenceModalUtils'

const { CONFIRM_DISCARD, DISCARD } = LABELS.BUTTON
const { REFERENCES } = SELECTED.SETTINGS
const { SAVING } = PROCESSING

const useAddReferenceButton = () => {
  const { isDoiUnique } = use(PanelDataContext)
  const { addReference } = use(ReferencesContext)
  const { closeModal, createModal, updateModalData, setProcessing } =
    useReferencesModalOperationsContext()
  const { getSelected, getSettings } = use(SelectedContext)

  const conceptName = getSelected(SELECTED.CONCEPT)
  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)

  const initialReferenceData = useMemo(() =>
    createInitialReference(byConcept ? conceptName : null), [byConcept, conceptName])

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

        const onAction = label =>
          label === DISCARD ? closeModal() : updateModalData({ confirmDiscard: false })

        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const actions = createModalActions(handleCancel, handleCommit)(modalData)
      if (!Array.isArray(actions)) return null

      const colors = actions.map(a => a.color || 'main')
      const disabled = actions.map(a => a.disabled || false)
      const labels = actions.map((a, i) => (i === 0 && modalData?.hasChanges) ? DISCARD : a.label)

      const onAction = label => {
        if (label === DISCARD || label === CONFIRM_DISCARD) {
          updateModalData({ confirmDiscard: true })
          return
        }
        const action = actions.find(x => x.label === label)
        if (action && action.onClick) {
          action.onClick()
        }
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
        reference: initialReferenceData,
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
  }, [createModal, initialReferenceData, handleCancel, handleCommit, closeModal, updateModalData, handleFormChange])

  const AddReferenceButton = useCallback(
    () => <PanelAddButton onClick={addReferenceModal} />,
    [addReferenceModal]
  )

  return AddReferenceButton
}

export default useAddReferenceButton
