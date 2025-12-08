import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import useDebounce from '@/lib/hooks/useDebounce'

import { hasTrue } from '@/lib/utils'

const useEditAliasHandlers = (formAlias, setFormAlias, stagedAlias) => {
  const { modifyConcept } = use(ConceptContext)
  const { closeModal, modalData, setModalData } = use(ConceptModalContext)

  // Debounced function to update modalData (for validation and external components)
  const debouncedUpdateModalData = useDebounce(
    useCallback(
      (updatedAlias, modified) => {
        setModalData(prev => ({ ...prev, aliasItem: updatedAlias, modified }))
      },
      [setModalData]
    )
  )

  const handleStage = useCallback(event => {
    event.preventDefault()

    const { action, aliasIndex, aliasItem } = modalData

    modifyConcept({
      type: action,
      update: {
        aliasIndex,
        aliasItem,
      },
    })

    closeModal(true)
  }, [closeModal, modalData, modifyConcept])

  const handleChange = useCallback(
    field => event => {
      const value = event.target.value
      const updatedAlias = {
        ...formAlias,
        [field]: value,
      }

      // Immediate UI update
      setFormAlias(updatedAlias)

      // Check if field is modified compared to staged alias
      const fieldIsModified = updatedAlias[field] !== stagedAlias[field]
      const updatedModified = { ...modalData.modified, [field]: fieldIsModified }

      // Check if any field is modified
      const _modified = hasTrue(updatedModified)

      // Debounced modalData update (for validation, Actions component, etc.)
      debouncedUpdateModalData(updatedAlias, updatedModified)
    },
    [stagedAlias, formAlias, modalData.modified, setFormAlias, debouncedUpdateModalData]
  )

  return {
    handleStage,
    handleChange,
  }
}

export default useEditAliasHandlers
