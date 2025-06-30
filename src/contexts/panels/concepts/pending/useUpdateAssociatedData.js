import { use, useCallback } from 'react'

import PanelModalContext from '@/contexts/modal/panel/PanelModalContext'

import { updateAssociatedData } from '@/lib/api/concepts'

const useUpdateAssociatedData = () => {
  const { modalData: _modalData } = use(PanelModalContext)

  return useCallback(async data => {
    try {
      await updateAssociatedData(data)
    } catch (error) {
      console.error('Error updating associated data:', error)
    }
  }, [])
}

export default useUpdateAssociatedData
