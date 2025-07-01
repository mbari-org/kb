import { use, useCallback } from 'react'

import HOLDModalContext from '@/contexts/modal/panel/HOLDModalContext'

import { updateAssociatedData } from '@/lib/api/concepts'

const useUpdateAssociatedData = () => {
  const { modalData: _modalData } = use(HOLDModalContext)

  return useCallback(async data => {
    try {
      await updateAssociatedData(data)
    } catch (error) {
      console.error('Error updating associated data:', error)
    }
  }, [])
}

export default useUpdateAssociatedData
