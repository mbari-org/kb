import { use, useCallback } from 'react'

import ConceptModalContext from '@/contexts/modal/ConceptModalContext'

import { updateAssociatedData } from '@/lib/api/concepts'

const useUpdateAssociatedData = () => {
  const { modalData: _modalData } = use(ConceptModalContext)

  return useCallback(async data => {
    try {
      await updateAssociatedData(data)
    } catch (error) {
      console.error('Error updating associated data:', error)
    }
  }, [])
}

export default useUpdateAssociatedData
