import { use, useCallback, useMemo } from 'react'

import { useTemplatesModalOperationsContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import ConceptTitle from '@/components/common/ConceptTitle'
import { usePanelModalDataContext } from '@/contexts/panel/modal/Context'

import { PROCESSING } from '@/lib/constants'
import {
  createDeleteTemplateActions,
  createDeleteTemplateContent,
} from '@/components/kb/panels/templates/form/templateModalUtils'

const { DELETING } = PROCESSING

const useDeleteTemplateButton = () => {
  const { deleteTemplate } = use(TemplatesContext)

  const { closeModal, createModal, setProcessing } = useTemplatesModalOperationsContext()

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

  return useCallback(
    template => {
      const modalData = {
        template,
      }

      const ContentView = () => {
        const { modalData } = usePanelModalDataContext()
        return memoizedContent(modalData)
      }

      createModal({
        actions: memoizedActions,
        contentComponent: ContentView,
        data: modalData,
        titleComponent: ConceptTitle,
      })
    },
    [createModal, memoizedActions, memoizedContent]
  )
}

export default useDeleteTemplateButton
