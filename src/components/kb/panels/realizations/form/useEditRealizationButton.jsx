import { use, useCallback, useMemo } from 'react'

import { useRealizationsModalOperationsContext, useRealizationsModalDataContext } from '@/contexts/panels/realizations/modal'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import RealizationTitle from '@/components/kb/panels/realizations/form/RealizationTitle'
import Actions from '@/components/common/factory/Actions'
import { createError, createValidationError } from '@/lib/errors'

import {
  createHandlers,
  createModalActions,
  createEditContent,
  processEditRealizationData,
  createRealizationOnClose,
  duplicateRealizationAlert,
  isDuplicateRealization,
  discardEditsAlert,
  confirmRealizationSaveAlert,
} from '@/components/kb/panels/realizations/form/realizationModalUtils'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG
const { CANCEL, CONTINUE, DISCARD, SAVE } = CONFIG.BUTTON

const useEditRealizationButton = () => {
  const { closeModal, createModal, updateModalData, withProcessing } = useRealizationsModalOperationsContext()
  const { editRealization } = use(RealizationsContext)
  const { getConceptRealizations } = use(PanelDataContext)
  const { loadConcept } = use(TaxonomyContext)

  const isDuplicateCheck = useCallback(
    (realization, original) =>
      isDuplicateRealization(getConceptRealizations(original.concept) ?? [], realization, original.id),
    [getConceptRealizations]
  )

  const { handleCancel, handleFormChange } = useMemo(
    () => createHandlers(updateModalData, closeModal, isDuplicateCheck),
    [updateModalData, closeModal, isDuplicateCheck]
  )
  const handleValidationChange = useCallback(
    ({ isValidToConcept }) => {
      updateModalData({ isValidToConcept })
    },
    [updateModalData]
  )

  const handleCommit = useCallback(
    async (realization, original) => {
      try {
        const updatedData = processEditRealizationData(realization, original)

        if (!updatedData) {
          updateModalData({ confirmCommit: false })
          closeModal()
          return
        }
        if (isDuplicateRealization(getConceptRealizations(original.concept) ?? [], realization, original.id)) {
          updateModalData({ confirmCommit: false })
          throw createValidationError('Realization already exists', {
            realizationId: realization?.id,
            duplicateToConcept: realization?.toConcept,
            duplicateLinkName: realization?.linkName,
          })
        }

        await withProcessing(async () => {
          await editRealization(original, updatedData)
          closeModal(true)
        }, PROCESSING.UPDATE)
      } catch (error) {
        if (error.title === 'Validation Error') {
          if (error.message === 'Realization already exists') {
            updateModalData({ alert: duplicateRealizationAlert() })
          }
          throw error
        }
        throw createError(
          'Realization Update Error',
          'Failed to update realization',
          { realizationId: realization?.id },
          error
        )
      }
    },
    [editRealization, getConceptRealizations, closeModal, updateModalData, withProcessing]
  )

  const editRealizationModal = useCallback(
    realizationToEdit => {
      loadConcept(realizationToEdit.concept)

      const onClose = createRealizationOnClose(updateModalData)

      const ActionView = () => {
        const { modalData } = useRealizationsModalDataContext()

        if (modalData.confirmDiscard) {
          const colors = ['cancel', 'main']
          const disabled = [false, false]
          const labels = [DISCARD, CONTINUE]
          const onAction = async label => {
            switch (label) {
              case DISCARD:
                closeModal()
                break

              case CONTINUE:
                updateModalData({ confirmDiscard: false, alert: null })
                break

              default:
                throw new Error(`Invalid edit realization discard action: ${label}`)
            }
          }
          return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
        }

        if (modalData.confirmCommit) {
          const colors = ['cancel', 'primary']
          const disabled = [false, !!modalData.isDuplicate]
          const labels = [CANCEL, SAVE]
          const onAction = async label => {
            switch (label) {
              case CANCEL:
                updateModalData({ confirmCommit: false, alert: null, confirmDiscard: false })
                closeModal(false)
                break

              case SAVE:
                await handleCommit(modalData.realization, modalData.original)
                break

              default:
                throw new Error(`Invalid edit realization commit action: ${label}`)
            }
          }
          return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
        }

        const actions = createModalActions(handleCancel, handleCommit, updateModalData)(modalData)
        if (!actions) return null

        const colors = actions.map(a => a.color || 'main')
        const disabled = actions.map(a => a.disabled || false)
        const labels = actions.map((a, i) => (i === 0 && modalData.hasChanges ? DISCARD : a.label))

        const onAction = async label => {
          switch (label) {
            case DISCARD:
              updateModalData({ confirmDiscard: true, alert: discardEditsAlert() })
              break

            case CANCEL:
              closeModal(false)
              break

            case SAVE:
              updateModalData({ confirmCommit: true, alert: confirmRealizationSaveAlert() })
              break

            default:
              throw new Error(`Invalid edit realization action: ${label}`)
          }
        }

        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const ContentView = () => {
        const { modalData } = useRealizationsModalDataContext()
        const RealizationModalContent = createEditContent(handleFormChange, handleValidationChange, updateModalData)
        return RealizationModalContent(modalData)
      }

      createModal({
        actionsComponent: ActionView,
        contentComponent: ContentView,
        titleComponent: RealizationTitle,
        data: {
          confirmDiscard: false,
          confirmCommit: false,
          hasChanges: false,
          isDuplicate: false,
          isValid: true,
          isValidToConcept: true,
          original: realizationToEdit,
          realization: { ...realizationToEdit },
        },
        onClose,
      })
    },
    [closeModal, createModal, handleCancel, handleCommit, handleFormChange, handleValidationChange, loadConcept, updateModalData]
  )

  return editRealizationModal
}

export default useEditRealizationButton
