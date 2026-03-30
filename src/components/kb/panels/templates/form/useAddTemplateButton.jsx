import { use, useCallback, useMemo } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'
import TemplateTitle from '@/components/kb/panels/templates/form/TemplateTitle'
import Actions from '@/components/common/factory/Actions'

import { useTemplatesModalOperationsContext, useTemplatesModalDataContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import { EMPTY_REALIZATION } from '@/lib/model/realization'

import CONFIG from '@/text'
import { SELECTED } from '@/lib/constants/selected.js'

import {
  createModalActions,
  createTemplateValidator,
  processAddTemplateData,
  createHandlers,
  createModalContent,
  createTemplateOnClose,
  duplicateTemplateAlert,
  isDuplicateTemplate,
  discardEditsAlert,
  confirmTemplateSaveAlert,
} from '@/components/kb/panels/templates/form/templateModalUtils'

const { PROCESSING } = CONFIG

const useAddTemplateButton = () => {
  const { addTemplate, filters } = use(TemplatesContext)
  const { templates: allTemplates } = use(PanelDataContext)

  const { closeModal, createModal, updateModalData, withProcessing } =
    useTemplatesModalOperationsContext()

  const { handleCancel, handleFormChange } = useMemo(
    () => createHandlers(updateModalData, closeModal, false),
    [updateModalData, closeModal]
  )

  const handleCommit = useCallback(
    async template => {
      const validateTemplate = createTemplateValidator(false)
      if (!validateTemplate(template)) {
        updateModalData({ confirmCommit: false })
        return
      }

      if (isDuplicateTemplate(allTemplates, template)) {
        updateModalData({ confirmCommit: false, alert: duplicateTemplateAlert() })
        return
      }

      await withProcessing(async () => {
        const templateData = processAddTemplateData(template)
        await addTemplate(templateData)
        closeModal()
      }, PROCESSING.SAVE)
    },
    [addTemplate, allTemplates, closeModal, updateModalData, withProcessing]
  )

  const addTemplateModal = useCallback(() => {
    const onClose = createTemplateOnClose(updateModalData)

    const ActionView = () => {
      const { modalData } = useTemplatesModalDataContext()

      // In confirm-discard, render explicit Discard/Continue that close or continue
      if (modalData.confirmDiscard) {
        const colors = ['cancel', 'main']
        const disabled = [false, false]
        const labels = [CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.DISCARD, CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.CONTINUE]
        const onAction = label => {
          if (label === CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.DISCARD) {
            closeModal()
          } else {
            updateModalData({ confirmDiscard: false, alert: null })
          }
        }
        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      if (modalData.confirmCommit) {
        const colors = ['cancel', 'primary']
        const disabled = [false, false]
        const labels = [CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.CANCEL, CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.SAVE]
        const onAction = label => {
          if (label === CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.CANCEL) {
            updateModalData({ confirmCommit: false, alert: null, confirmDiscard: false })
            closeModal(false)
          } else {
            return handleCommit(modalData.template)
          }
        }
        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const actions = createModalActions(handleCancel, handleCommit, updateModalData)(modalData)
      if (!Array.isArray(actions)) return null

      const colors = actions.map(a => a.color || 'main')
      const disabled = actions.map(a => a.disabled || false)
      const labels = actions.map((a, i) =>
        i === 0 && modalData.hasChanges ? CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.DISCARD : a.label
      )

      const onAction = label => {
        if (label === CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.DISCARD) {
          updateModalData({ confirmDiscard: true, alert: discardEditsAlert() })
          return
        }
        if (label === CONFIG.PANELS.TEMPLATES.MODALS.BUTTON.SAVE) {
          updateModalData({ confirmCommit: true, alert: confirmTemplateSaveAlert() })
          return
        }
        const a = actions.find(x => x.label === label)
        if (a && a.onClick) return a.onClick()
      }

      return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
    }

    const ContentView = () => {
      const { modalData } = useTemplatesModalDataContext()
      const TemplateModalContent = createModalContent(handleFormChange, false)
      return TemplateModalContent(modalData)
    }

    createModal({
      actionsComponent: ActionView,
      contentComponent: ContentView,
      titleComponent: TemplateTitle,
      data: {
        confirmDiscard: false,
        confirmCommit: false,
        hasChanges: false,
        isValid: false,
        template: {
          ...EMPTY_REALIZATION,
          concept: filters[SELECTED.SETTINGS.TEMPLATES.FILTERS.CONCEPT],
        },
      },
      onClose,
    })
  }, [closeModal, createModal, filters, handleCancel, handleCommit, handleFormChange, updateModalData])

  const AddTemplateButton = useCallback(() => {
    const { TEMPLATES } = SELECTED.SETTINGS
    const conceptSelected = Boolean(filters?.[TEMPLATES.FILTERS.CONCEPT])
    const tooltip = conceptSelected
      ? CONFIG.PANELS.TEMPLATES.TOOLTIP.ADD.CONCEPT_SELECTED
      : CONFIG.PANELS.TEMPLATES.TOOLTIP.ADD.CONCEPT_NOT_SELECTED

    return (
      <PanelAddButton
        disabled={!conceptSelected}
        onClick={addTemplateModal}
        tooltip={tooltip}
        label={CONFIG.PANELS.TEMPLATES.BUTTON.ADD}
      />
    )
  }, [addTemplateModal, filters])

  return AddTemplateButton
}

export default useAddTemplateButton
