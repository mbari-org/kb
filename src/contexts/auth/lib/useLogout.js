import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import authStore from '@/lib/store/authStore'
import { getConceptStore } from '@/lib/store/conceptStore'
import { getPanelStore } from '@/lib/store/panelStore'
import selectedStore from '@/lib/store/settingsStore'

const useLogout = setUser => {
  const navigate = useNavigate()

  return useCallback(() => {
    authStore.remove()
    getConceptStore().remove()
    getPanelStore().remove()
    selectedStore.remove()

    setUser(null)
    navigate('/login')
    // navigate does not change, so no need to include it in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser])
}

export default useLogout
