import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getConceptHistory } from '@/lib/kb/api/history'

const useLoadConceptHistory = () => {
  const { apiFns } = use(ConfigContext)

  const loadConceptHistory = useCallback(
    async conceptName => {
      if (!apiFns || !conceptName) return { data: [], count: 0 }
      const data = await apiFns.apiPayload(getConceptHistory, conceptName)
      return { data, count: data.length }
    },
    [apiFns]
  )

  return loadConceptHistory
}

export default useLoadConceptHistory
