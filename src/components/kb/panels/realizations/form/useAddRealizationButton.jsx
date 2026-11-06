import { use, useCallback, useMemo } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'
import RealizationTitle from '@/components/kb/panels/realizations/form/RealizationTitle'
import Actions from '@/components/common/factory/Actions'

import { useRealizationsModalOperationsContext, useRealizationsModalDataContext } from '@/contexts/panels/realizations/modal'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { createError, createValidationError } from '@/lib/errors'
import { EMPTY_REALIZATION } from '@/lib/model/realization'

import {
  createHandlers,
  createModalActions,
  createAddContent,
  processAddRealizationData,
  createAddRealizationOnClose,
  duplicateAddRealizationAlert,
  isDuplicateRealization,
  discardAddRealizationAlert,
  confirmAddRealizationSaveAlert,
} from '@/components/kb/panels/realizations/form/realizationModalUtils'

import CONFIG from '@/lib/config'
import { SELECTED } from '@/lib/constants/selected.js'

const { PROCESSING } = CONFIG
const { CANCEL, CONTINUE, DISCARD, SAVE } = CONFIG.BUTTON
const { REALIZATIONS } = SELECTED.SETTINGS

const useAddRealizationButton = () => {
  const { closeModal, createModal, updateModalData, withProcessing } = useRealizationsModalOperationsContext()
  const { addRealization, filters } = use(RealizationsContext)
  const { getConceptRealizations } = use(PanelDataContext)
  const { loadConcept } = use(TaxonomyContext)

  const isDuplicateCheck = useCallback(
    realization => isDuplicateRealization(getConceptRealizations(realization.concept) ?? [], realization),
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
    async realization => {
      try {
        if (isDuplicateCheck(realization)) {
          updateModalData({ confirmCommit: false })
          throw createValidationError('Realization already exists', {
            duplicateToConcept: realization?.toConcept,
            duplicateLinkName: realization?.linkName,
          })
        }

        await withProcessing(async () => {
          await addRealization(processAddRealizationData(realization))
          closeModal(true)
        }, PROCESSING.SAVE)
      } catch (error) {
        if (error.title === 'Validation Error') {
          if (error.message === 'Realization already exists') {
            updateModalData({ alert: duplicateAddRealizationAlert() })
          }
          throw error
        }
        throw createError('Realization Add Error', 'Failed to add realization', { concept: realization?.concept }, error)
      }
    },
    [addRealization, closeModal, isDuplicateCheck, updateModalData, withProcessing]
  )

  const addRealizationModal = useCallback(() => {
    const concept = filters[REALIZATIONS.FILTERS.CONCEPT]
    loadConcept(concept)

    const onClose = createAddRealizationOnClose(updateModalData)

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
              throw new Error(`Invalid add realization discard action: ${label}`)
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
              await handleCommit(modalData.realization)
              break

            default:
              throw new Error(`Invalid add realization commit action: ${label}`)
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
            updateModalData({ confirmDiscard: true, alert: discardAddRealizationAlert() })
            break

          case CANCEL:
            closeModal(false)
            break

          case SAVE:
            updateModalData({ confirmCommit: true, alert: confirmAddRealizationSaveAlert() })
            break

          default:
            throw new Error(`Invalid add realization action: ${label}`)
        }
      }

      return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
    }

    const ContentView = () => {
      const { modalData } = useRealizationsModalDataContext()
      const RealizationModalContent = createAddContent(handleFormChange, handleValidationChange, updateModalData)
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
        isValid: false,
        isValidToConcept: true,
        original: { ...EMPTY_REALIZATION, concept },
        realization: { ...EMPTY_REALIZATION, concept },
      },
      onClose,
    })
  }, [
    closeModal,
    createModal,
    filters,
    handleCancel,
    handleCommit,
    handleFormChange,
    handleValidationChange,
    loadConcept,
    updateModalData,
  ])

  const AddRealizationButton = useCallback(() => {
    const conceptSelected = Boolean(filters?.[REALIZATIONS.FILTERS.CONCEPT])
    const tooltip = conceptSelected
      ? CONFIG.PANELS.REALIZATIONS.PANEL.TOOLTIP.ADD.CONCEPT_SELECTED
      : CONFIG.PANELS.REALIZATIONS.PANEL.TOOLTIP.ADD.CONCEPT_NOT_SELECTED

    return (
      <PanelAddButton
        disabled={!conceptSelected}
        onClick={addRealizationModal}
        tooltip={tooltip}
        label={CONFIG.BUTTON.ADD}
      />
    )
  }, [addRealizationModal, filters])

  return AddRealizationButton
}

export default useAddRealizationButton
