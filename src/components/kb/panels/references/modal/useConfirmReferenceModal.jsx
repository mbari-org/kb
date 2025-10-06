import { use, useCallback } from 'react'

import { useReferencesModalOperationsContext, useReferencesModalDataContext } from '@/contexts/panels/references/modal'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import Title from '@/components/common/factory/Title'
import Actions from '@/components/common/factory/Actions'
import ConfirmReferencesContent from './ConfirmReferenceContent'
import { createError } from '@/lib/errors'

import { PROCESSING } from '@/lib/constants'

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

        const actions = [
          {
            color: 'cancel',
            disabled: false,
            label: 'Continue',
            onClick: () => {
              closeModal()
              if (reopenEditModal) {
                reopenEditModal(modalData.reference)
              }
            },
          },
          {
            color: 'primary',
            disabled: false,
            label: 'Confirm',
            onClick: () => handleConfirm(modalData.reference, modalData.original),
          },
        ]

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
