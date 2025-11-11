import { use, useCallback } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import { useTemplatesModalOperationsContext, useTemplatesModalDataContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import ConceptTitle from '@/components/common/ConceptTitle'
import Actions from '@/components/common/factory/Actions'
import { createError } from '@/lib/errors'

import { PROCESSING } from '@/lib/constants/constants'
import {
  createDeleteTemplateActions,
  createDeleteTemplateContent,
} from '@/components/kb/panels/templates/form/templateModalUtils'

const { DELETING } = PROCESSING

const useDeleteTemplateButton = () => {
  const { showBoundary } = useErrorBoundary()
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
        const deleteError = createError(
          'Template Delete Error',
          'Failed to delete template',
          { templateId: template?.id },
          error
        )
        showBoundary(deleteError)
      }
    },
    [closeModal, deleteTemplate, setProcessing, showBoundary]
  )

  return useCallback(
    template => {
      const ActionView = () => {
        const { modalData } = useTemplatesModalDataContext()
        const actions = createDeleteTemplateActions(handleCancel, handleDeleteConfirm)(modalData)
        if (!Array.isArray(actions)) return null

        const colors = actions.map(a => a.color || 'main')
        const disabled = actions.map(a => a.disabled || false)
        const labels = actions.map(a => a.label)

        const onAction = label => {
          const a = actions.find(x => x.label === label)
          if (a && a.onClick) a.onClick()
        }

        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const ContentView = () => {
        const { modalData } = useTemplatesModalDataContext()
        const DeleteTemplateContent = createDeleteTemplateContent()
        return DeleteTemplateContent(modalData)
      }

      createModal({
        actionsComponent: ActionView,
        contentComponent: ContentView,
        data: {
          template,
        },
        titleComponent: ConceptTitle,
      })
    },
    [createModal, handleCancel, handleDeleteConfirm]
  )
}

export default useDeleteTemplateButton
