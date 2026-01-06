import { use, useCallback } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import { useReferencesModalOperationsContext, useReferencesModalDataContext } from '@/contexts/panels/references/modal'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import Title from '@/components/common/factory/Title'
import Actions from '@/components/common/factory/Actions'
import { createError } from '@/lib/errors'

import {
  createDeleteReferenceActions,
  createDeleteReferenceContent,
} from '@/components/kb/panels/references/modal/referenceModalUtils'

import CONFIG from '@/text'

const { PROCESSING } = CONFIG

const useDeleteReferenceButton = () => {
  const { createModal, closeModal, withProcessing } = useReferencesModalOperationsContext()
  const { deleteReference } = use(ReferencesContext)

  const handleCancel = useCallback(() => {
    closeModal()
  }, [closeModal])

  const { showBoundary } = useErrorBoundary()

  const handleDeleteConfirm = useCallback(
    async reference => {
      try {
        await withProcessing(async () => {
          await deleteReference(reference)
          closeModal()
        }, PROCESSING.DELETE)
      } catch (error) {
        const deleteError = createError(
          'Reference Delete Error',
          'Failed to delete reference',
          { referenceId: reference?.id },
          error
        )
        showBoundary(deleteError)
      }
    },
    [deleteReference, closeModal, showBoundary, withProcessing]
  )

  return useCallback(
    reference => {
      const ActionView = () => {
        const { modalData } = useReferencesModalDataContext()
        const actions = createDeleteReferenceActions(handleCancel, handleDeleteConfirm)(modalData)
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
        const { modalData } = useReferencesModalDataContext()
        const DeleteReferenceContent = createDeleteReferenceContent()
        return DeleteReferenceContent(modalData)
      }

      const TitleView = () => <Title title={CONFIG.PANELS.REFERENCES.MODALS.DELETE.TITLE} />

      createModal({
        actionsComponent: ActionView,
        contentComponent: ContentView,
        titleComponent: TitleView,
        data: {
          reference,
        },
      })
    },
    [createModal, handleCancel, handleDeleteConfirm]
  )
}

export default useDeleteReferenceButton
