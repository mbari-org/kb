import { use, useCallback, useMemo } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'

import { useTemplatesModalOperationsContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { EMPTY_TEMPLATE } from '@/lib/kb/model/template'

import { PROCESSING } from '@/lib/constants'

import {
  createModalActions,
  createTemplateValidator,
  processAddTemplateData,
  createHandlers,
  createModalContent,
} from '@/components/kb/panels/templates/form/templateModalUtils'

const { SAVING } = PROCESSING

const useAddTemplateButton = () => {
  const { closeModal, createModal, updateModalData, setProcessing } =
    useTemplatesModalOperationsContext()
  const { addTemplate } = use(TemplatesContext)

  const { handleCancel, handleFormChange } = useMemo(
    () => createHandlers(updateModalData, closeModal, false),
    [updateModalData, closeModal]
  )

  const handleCommit = useCallback(
    async template => {
      try {
        const validateTemplate = createTemplateValidator(false)
        if (!validateTemplate(template)) {
          return
        }

        setProcessing(SAVING)

        const templateData = processAddTemplateData(template)
        await addTemplate(templateData)
        closeModal()
      } catch (error) {
        setProcessing(false)
        throw error
      }
    },
    [addTemplate, closeModal, setProcessing]
  )

  const content = useCallback(
    currentModalData => createModalContent(handleFormChange, false)(currentModalData),
    [handleFormChange]
  )

  const addTemplateModal = useCallback(() => {
    createModal({
      actions: createModalActions(handleCancel, handleCommit),
      content,
      title: 'Add Template',
      data: {
        template: EMPTY_TEMPLATE,
        isValid: false,
        hasChanges: false,
      },
    })
  }, [createModal, content, handleCancel, handleCommit])

  const AddTemplateButton = useCallback(
    () => <PanelAddButton onClick={addTemplateModal} />,
    [addTemplateModal]
  )

  return AddTemplateButton
}

export default useAddTemplateButton
