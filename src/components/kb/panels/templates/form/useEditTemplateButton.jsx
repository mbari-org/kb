import { use, useCallback, useMemo } from 'react'

import { useTemplatesModalOperationsContext, useTemplatesModalDataContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TemplateTitle from '@/components/kb/panels/templates/form/TemplateTitle'
import Actions from '@/components/common/factory/Actions'
import { createError, createValidationError } from '@/lib/errors'

import {
  createHandlers,
  createModalActions,
  createModalContent,
  processAddTemplateData,
  processEditTemplateData,
  createTemplateOnClose,
  duplicateTemplateAlert,
  isDuplicateTemplate,
  discardEditsAlert,
  confirmTemplateSaveAlert,
} from '@/components/kb/panels/templates/form/templateModalUtils'

import CONFIG from '@/text'

const { PROCESSING } = CONFIG
const { CANCEL, CONTINUE, DISCARD, SAVE } = CONFIG.PANELS.TEMPLATES.MODALS.BUTTON

const useEditTemplateButton = () => {
  const { closeModal, createModal, updateModalData, withProcessing } =
    useTemplatesModalOperationsContext()
  const { addTemplate, deleteTemplate, editTemplate } = use(TemplatesContext)
  const { templates: allTemplates } = use(PanelDataContext)

  const { handleCancel, handleFormChange } = useMemo(
    () => createHandlers(updateModalData, closeModal, true),
    [updateModalData, closeModal]
  )
  const handleDuplicateChange = useCallback(
    isDuplicate => {
      updateModalData({ isDuplicate })
    },
    [updateModalData]
  )

  const handleCommit = useCallback(
    async (template, original) => {
      try {
        const updatedData = processEditTemplateData(template, original)

        if (!updatedData) {
          updateModalData({ confirmCommit: false })
          closeModal()
          return
        }
        const isIdentityChanged =
          template.concept !== original.concept ||
          template.linkName !== original.linkName ||
          template.toConcept !== original.toConcept

        // Duplicate check (exclude the original template by id)
        if (isDuplicateTemplate(allTemplates, template, original.id)) {
          updateModalData({ confirmCommit: false })
          throw createValidationError('Template already exists', {
            templateId: template?.id,
            duplicateToConcept: template?.toConcept,
            duplicateLinkName: template?.linkName,
          })
        }

        await withProcessing(async () => {
          if (isIdentityChanged) {
            await addTemplate(processAddTemplateData(template))
            await deleteTemplate(original)
          } else {
            await editTemplate(original, updatedData)
          }
          closeModal()
        }, PROCESSING.UPDATE)
      } catch (error) {
        if (error.title === 'Validation Error') {
          if (error.message === 'Template already exists') {
            updateModalData({ alert: duplicateTemplateAlert() })
          }
          throw error
        }
        throw createError(
          'Template Update Error',
          'Failed to update template',
          { templateId: template?.id },
          error
        )
      }
    },
    [allTemplates, addTemplate, deleteTemplate, editTemplate, closeModal, updateModalData, withProcessing]
  )

  const editTemplateModal = useCallback(
    templateToEdit => {
      const onClose = createTemplateOnClose(updateModalData)

      const ActionView = () => {
        const { modalData } = useTemplatesModalDataContext()

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
                throw new Error(`Invalid edit template discard action: ${label}`)
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
                await handleCommit(modalData.template, modalData.original)
                break

              default:
                throw new Error(`Invalid edit template commit action: ${label}`)
            }
          }
          return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
        }

        const actions = createModalActions(handleCancel, handleCommit, updateModalData)(modalData)
        if (!Array.isArray(actions)) return null

        const colors = actions.map(a => a.color || 'main')
        const disabled = actions.map(a => a.disabled || false)
        const labels = actions.map((a, i) =>
          i === 0 && modalData.hasChanges ? DISCARD : a.label
        )

        const onAction = async label => {
          switch (label) {
            case DISCARD:
              updateModalData({ confirmDiscard: true, alert: discardEditsAlert() })
              break

            case CANCEL:
              closeModal(false)
              break

            case SAVE:
              updateModalData({ confirmCommit: true, alert: confirmTemplateSaveAlert() })
              break

            default:
              throw new Error(`Invalid edit template action: ${label}`)
          }
        }

        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const ContentView = () => {
        const { modalData } = useTemplatesModalDataContext()
        const TemplateModalContent = createModalContent(handleFormChange, true, handleDuplicateChange)
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
          isDuplicate: false,
          isValid: true,
          original: templateToEdit,
          template: { ...templateToEdit },
        },
        onClose,
      })
    },
    [closeModal, createModal, handleCancel, handleCommit, handleDuplicateChange, handleFormChange, updateModalData]
  )

  return editTemplateModal
}

export default useEditTemplateButton
