import { use, useCallback, useMemo } from 'react'

import { useTemplatesModalOperationsContext, useTemplatesModalDataContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptTitle from '@/components/common/ConceptTitle'
import Actions from '@/components/common/factory/Actions'
import { createError, createValidationError } from '@/lib/errors'

import { PROCESSING } from '@/lib/constants'
import {
  createHandlers,
  createModalActions,
  createModalContent,
  processEditTemplateData,
  createTemplateOnClose,
  duplicateTemplateAlert,
  isDuplicateTemplate,
  discardEditsAlert,
} from '@/components/kb/panels/templates/form/templateModalUtils'

const { UPDATING } = PROCESSING

const useEditTemplateButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } =
    useTemplatesModalOperationsContext()
  const { editTemplate } = use(TemplatesContext)
  const { templates: allTemplates } = use(PanelDataContext)

  const { handleCancel, handleFormChange } = useMemo(
    () => createHandlers(updateModalData, closeModal, true),
    [updateModalData, closeModal]
  )

  const handleCommit = useCallback(
    async (template, original) => {
      try {
        const updatedData = processEditTemplateData(template, original)

        if (!updatedData) {
          closeModal()
          return
        }

        // Duplicate check (exclude the original template by id)
        if (isDuplicateTemplate(allTemplates, template, original.id)) {
          throw createValidationError('Template already exists', {
            templateId: template?.id,
            duplicateToConcept: template?.toConcept,
            duplicateLinkName: template?.linkName,
          })
        }

        setProcessing(UPDATING)
        await editTemplate(original, template)
        closeModal()
      } catch (error) {
        setProcessing(false)
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
    [allTemplates, editTemplate, closeModal, setProcessing, updateModalData]
  )

  const editTemplateModal = useCallback(
    templateToEdit => {
      const onClose = createTemplateOnClose(updateModalData)

      const ActionView = () => {
        const { modalData } = useTemplatesModalDataContext()

        if (modalData?.confirmDiscard) {
          const colors = ['cancel', 'main']
          const disabled = [false, false]
          const labels = ['Discard', 'Continue']
          const onAction = label => {
            if (label === 'Discard') {
              closeModal()
            } else {
              updateModalData({ confirmDiscard: false, alert: null })
            }
          }
          return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
        }

        const actions = createModalActions(handleCancel, handleCommit, updateModalData)(modalData)
        if (!Array.isArray(actions)) return null

        const colors = actions.map(a => a.color || 'main')
        const disabled = actions.map(a => a.disabled || false)
        const labels = actions.map((a, i) => (i === 0 && modalData?.hasChanges ? 'Discard' : a.label))

        const onAction = label => {
          if (label === 'Discard') {
            updateModalData({ confirmDiscard: true, alert: discardEditsAlert() })
            return
          }
          const a = actions.find(x => x.label === label)
          if (a && a.onClick) a.onClick()
        }

        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const ContentView = () => {
        const { modalData } = useTemplatesModalDataContext()
        const TemplateModalContent = createModalContent(handleFormChange, true)
        return TemplateModalContent(modalData)
      }

      createModal({
        actionsComponent: ActionView,
        contentComponent: ContentView,
        titleComponent: ConceptTitle,
        data: {
          confirmDiscard: false,
          hasChanges: false,
          isValid: true,
          original: templateToEdit,
          template: { ...templateToEdit },
        },
        onClose,
      })
    },
    [createModal, handleFormChange, handleCancel, handleCommit, updateModalData]
  )

  return editTemplateModal
}

export default useEditTemplateButton
