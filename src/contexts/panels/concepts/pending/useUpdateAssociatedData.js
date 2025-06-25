import { use, useCallback } from 'react'

import AppModalContext from '@/contexts/modal/AppModalContext'

import { updateAssociatedData } from '@/lib/api/concepts'

const useUpdateAssociatedData = () => {
  const { modalData: _modalData } = use(AppModalContext)

  return useCallback(async data => {
    try {
      await updateAssociatedData(data)
    } catch (error) {
      console.error('Error updating associated data:', error)
    }
  }, [])
}

export default useUpdateAssociatedData
