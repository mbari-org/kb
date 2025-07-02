import { use, useCallback, useMemo } from 'react'

import { useReferencesModalOperationsContext } from '@/contexts/panels/references/modal'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import { PROCESSING } from '@/lib/constants'
import {
  createDeleteReferenceActions,
  createDeleteReferenceContent,
  createDeleteReferenceTitle,
} from '@/components/kb/panels/references/form/referenceModalUtils'

const { DELETING } = PROCESSING

const useDeleteReferenceButton = () => {
  const { createModal, closeModal, setProcessing } = useReferencesModalOperationsContext()
  const { deleteReference } = use(ReferencesContext)

  const handleCancel = useCallback(() => {
    closeModal()
  }, [closeModal])

  const handleDeleteConfirm = useCallback(
    async reference => {
      try {
        setProcessing(DELETING)
        await deleteReference(reference)
        closeModal()
      } catch (error) {
        setProcessing(false)
        console.error('Error deleting reference:', error)
      }
    },
    [deleteReference, closeModal, setProcessing]
  )

  const memoizedActions = useMemo(
    () => createDeleteReferenceActions(handleCancel, handleDeleteConfirm),
    [handleCancel, handleDeleteConfirm]
  )
  const memoizedContent = useMemo(() => createDeleteReferenceContent(), [])
  const memoizedTitle = useMemo(() => createDeleteReferenceTitle, [])

  return useCallback(
    reference => {
      const modalData = {
        reference,
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

export default useDeleteReferenceButton
