import { use, useCallback, useMemo } from 'react'

import { useReferencesModalOperationsContext } from '@/contexts/panels/references/modal'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import Title from '@/components/common/factory/Title'
import { usePanelModalDataContext } from '@/contexts/panel/modal/Context'

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
      setProcessing(DELETING)
      await deleteReference(reference)
      closeModal()
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

      const ContentView = () => {
        const { modalData } = usePanelModalDataContext()
        return memoizedContent(modalData)
      }

      const TitleView = () => <Title title={memoizedTitle()} />

      createModal({
        actions: memoizedActions,
        contentComponent: ContentView,
        titleComponent: TitleView,
        data: modalData,
      })
    },
    [createModal, memoizedActions, memoizedContent, memoizedTitle]
  )
}

export default useDeleteReferenceButton
