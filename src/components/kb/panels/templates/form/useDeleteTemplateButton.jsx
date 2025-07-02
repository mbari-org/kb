import { use, useCallback, useMemo } from 'react'

import { useTemplatesModalOperationsContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { PROCESSING } from '@/lib/constants'
import {
  createDeleteTemplateActions,
  createDeleteTemplateContent,
  createDeleteTemplateTitle,
} from '@/components/kb/panels/templates/form/templateModalUtils'

const { DELETING } = PROCESSING

const useDeleteTemplateButton = () => {
  const { closeModal, createModal, setProcessing } = useTemplatesModalOperationsContext()
  const { deleteTemplate } = use(TemplatesContext)

  const handleCancel = useCallback(() => {
    closeModal()
  }, [closeModal])

  const handleDeleteConfirm = useCallback(
    async template => {
      try {
        setProcessing(DELETING)
        await deleteTemplate(template)
        closeModal()
      } catch (error) {
        setProcessing(false)
        console.error('Error deleting template:', error)
      }
    },
    [deleteTemplate, closeModal, setProcessing]
  )

  const memoizedActions = useMemo(
    () => createDeleteTemplateActions(handleCancel, handleDeleteConfirm),
    [handleCancel, handleDeleteConfirm]
  )
  const memoizedContent = useMemo(() => createDeleteTemplateContent(), [])
  const memoizedTitle = useMemo(() => createDeleteTemplateTitle, [])

  return useCallback(
    template => {
      const modalData = {
        template,
      }

      createModal({
        actions: memoizedActions,
        content: memoizedContent,
        title: memoizedTitle(),
        data: modalData,
      })
    },
    [createModal, memoizedActions, memoizedContent, memoizedTitle]
  )
}

export default useDeleteTemplateButton
