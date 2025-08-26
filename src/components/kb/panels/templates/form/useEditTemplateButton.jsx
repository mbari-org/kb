import { use, useCallback, useMemo } from 'react'

import { useTemplatesModalOperationsContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptTitle from '@/components/common/ConceptTitle'
import { createActionView, createContentView } from '@/contexts/panel/modal/factories'

import { PROCESSING } from '@/lib/constants'
import {
  createHandlers,
  createModalActions,
  createModalContent,
  processEditTemplateData,
  createTemplateOnClose,
  duplicateTemplateAlert,
  isDuplicateTemplate,
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
          updateModalData({ alert: duplicateTemplateAlert() })
          return
        }

        setProcessing(UPDATING)
        await editTemplate(original, template)
        closeModal()
      } catch (error) {
        setProcessing(false)
        throw error
      }
    },
    [allTemplates, editTemplate, closeModal, setProcessing, updateModalData]
  )

  const content = useCallback(
    currentModalData => createModalContent(handleFormChange, true)(currentModalData),
    [handleFormChange]
  )

  const editTemplateModal = useCallback(
    templateToEdit => {
      const onClose = createTemplateOnClose(updateModalData)

      const ActionView = createActionView(() =>
        createModalActions(handleCancel, handleCommit, updateModalData)
      )
      const ContentView = createContentView(content)

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
    [createModal, content, handleCancel, handleCommit, updateModalData]
  )

  return editTemplateModal
}

export default useEditTemplateButton
