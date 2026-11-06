import { use, useCallback } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import { useRealizationsModalOperationsContext, useRealizationsModalDataContext } from '@/contexts/panels/realizations/modal'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import RealizationTitle from '@/components/kb/panels/realizations/form/RealizationTitle'
import Actions from '@/components/common/factory/Actions'
import { createError } from '@/lib/errors'

import {
  createDeleteRealizationActions,
  createDeleteRealizationContent,
  confirmRealizationDeleteAlert,
} from '@/components/kb/panels/realizations/form/realizationModalUtils'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG
const { CANCEL, DELETE } = CONFIG.BUTTON

const useDeleteRealizationButton = () => {
  const { showBoundary } = useErrorBoundary()
  const { deleteRealization } = use(RealizationsContext)
  const { closeModal, createModal, updateModalData, withProcessing } = useRealizationsModalOperationsContext()

  const handleCancel = useCallback(() => {
    updateModalData({ confirmDelete: false, alert: null })
    closeModal()
  }, [closeModal, updateModalData])

  const handleDeleteConfirm = useCallback(
    async realization => {
      try {
        await withProcessing(async () => {
          await deleteRealization(realization)
          closeModal()
        }, PROCESSING.DELETE)
      } catch (error) {
        const deleteError = createError(
          'Realization Delete Error',
          'Failed to delete realization',
          { realizationId: realization?.id },
          error
        )
        showBoundary(deleteError)
      }
    },
    [closeModal, deleteRealization, showBoundary, withProcessing]
  )

  return useCallback(
    realization => {
      const ActionView = () => {
        const { modalData } = useRealizationsModalDataContext()
        const actions = createDeleteRealizationActions(handleCancel, handleDeleteConfirm)(modalData)
        if (!actions) return null

        const colors = actions.map(a => a.color || 'main')
        const disabled = actions.map(a => a.disabled || false)
        const labels = actions.map(a => a.label)

        const onAction = async label => {
          switch (label) {
            case CANCEL:
              handleCancel()
              break

            case DELETE:
              if (!modalData.confirmDelete) {
                updateModalData({ confirmDelete: true, alert: confirmRealizationDeleteAlert() })
                break
              }
              await handleDeleteConfirm(modalData.realization)
              break

            default:
              throw new Error(`Invalid delete realization action: ${label}`)
          }
        }

        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const ContentView = () => {
        const { modalData } = useRealizationsModalDataContext()
        const DeleteRealizationContent = createDeleteRealizationContent()
        return DeleteRealizationContent(modalData)
      }

      createModal({
        actionsComponent: ActionView,
        contentComponent: ContentView,
        data: {
          alert: null,
          confirmDelete: false,
          realization,
        },
        titleComponent: RealizationTitle,
      })
    },
    [createModal, handleCancel, handleDeleteConfirm, updateModalData]
  )
}

export default useDeleteRealizationButton
