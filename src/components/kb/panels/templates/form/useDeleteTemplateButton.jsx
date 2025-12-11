import { use, useCallback } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import { useTemplatesModalOperationsContext, useTemplatesModalDataContext } from '@/contexts/panels/templates/modal'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import TemplateTitle from '@/components/kb/panels/templates/form/TemplateTitle'
import Actions from '@/components/common/factory/Actions'
import { createError } from '@/lib/errors'

import {
  createDeleteTemplateActions,
  createDeleteTemplateContent,
} from '@/components/kb/panels/templates/form/templateModalUtils'

import CONFIG from '@/config'

const { PROCESSING } = CONFIG

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
        setProcessing(PROCESSING.DELETE)
        await deleteTemplate(template)
        closeModal()
      } catch (error) {
        setProcessing(PROCESSING.OFF)
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
        titleComponent: TemplateTitle,
      })
    },
    [createModal, handleCancel, handleDeleteConfirm]
  )
}

export default useDeleteTemplateButton
