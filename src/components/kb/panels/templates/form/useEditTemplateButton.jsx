import { use, useCallback, useMemo } from 'react'

import { useTemplatesModalOperationsContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { PROCESSING } from '@/lib/constants'
import {
  createModalActions,
  processEditTemplateData,
  createHandlers,
  createModalContent,
} from '@/components/kb/panels/templates/form/templateModalUtils'

const { UPDATING } = PROCESSING

const useEditTemplateButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } =
    useTemplatesModalOperationsContext()
  const { editTemplate } = use(TemplatesContext)

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

        setProcessing(UPDATING)
        await editTemplate(original, template)
        closeModal()
      } catch (error) {
        setProcessing(false)
        throw error
      }
    },
    [editTemplate, closeModal, setProcessing]
  )

  const content = useCallback(
    currentModalData => createModalContent(handleFormChange, true)(currentModalData),
    [handleFormChange]
  )

  const editTemplateModal = useCallback(
    templateToEdit => {
      createModal({
        actions: createModalActions(handleCancel, handleCommit),
        content,
        title: 'Edit Template',
        data: {
          template: { ...templateToEdit },
          original: templateToEdit,
          isValid: true,
          hasChanges: false,
        },
      })
    },
    [createModal, content, handleCancel, handleCommit]
  )

  return editTemplateModal
}

export default useEditTemplateButton
