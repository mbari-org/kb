import { use, useCallback } from 'react'

import Title from '@/components/common/factory/Title'
import Actions from '@/components/common/factory/Actions'
import ConfirmReferencesContent from './ConfirmReferenceContent'

import { createError } from '@/lib/errors'

import { useReferencesModalOperationsContext, useReferencesModalDataContext } from '@/contexts/panels/references/modal'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import { PROCESSING, LABELS } from '@/lib/constants'

const { UPDATING } = PROCESSING

const useConfirmReferenceModal = () => {
  const { closeModal, createModal, setProcessing } = useReferencesModalOperationsContext()
  const { editReference } = use(ReferencesContext)

  const handleConfirm = useCallback(
    async (reference, original) => {
      try {
        setProcessing(UPDATING)
        await editReference(original, reference)
        closeModal()
      } catch (error) {
        setProcessing(false)
        if (error.title === 'Validation Error') {
          throw error
        }
        throw createError(
          'Reference Update Error',
          'Failed to update reference',
          { referenceId: reference?.id },
          error
        )
      }
    },
    [editReference, closeModal, setProcessing]
  )

  const editReferenceModal = useCallback(
    (reference, original, reopenEditModal) => {
      const ActionView = () => {
        const { modalData } = useReferencesModalDataContext()

        const colors = ['cancel', 'main']
        const disabled = [false, false]
        const labels = [LABELS.BUTTON.CONTINUE, LABELS.BUTTON.CONFIRM]

        const onAction = label => {
          if (label === LABELS.BUTTON.CONTINUE) {
            closeModal()
            if (reopenEditModal) {
              reopenEditModal(modalData.reference)
            }
          } else if (label === LABELS.BUTTON.CONFIRM) {
            handleConfirm(modalData.reference, modalData.original)
          }
        }

        return <Actions colors={colors} disabled={disabled} labels={labels} onAction={onAction} />
      }

      const ContentView = () => {
        const { modalData } = useReferencesModalDataContext()
        const { reference: updated, original: orig } = modalData

        return <ConfirmReferencesContent reference={updated} original={orig} />
      }

      const TitleView = () => <Title title='Confirm Reference Changes' />

      createModal({
        actionsComponent: ActionView,
        contentComponent: ContentView,
        titleComponent: TitleView,
        data: {
          reference,
          original,
        },
      })
    },
    [createModal, closeModal, handleConfirm]
  )

  return editReferenceModal
}

export default useConfirmReferenceModal
