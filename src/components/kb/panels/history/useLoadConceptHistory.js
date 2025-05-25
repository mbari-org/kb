import { use, useCallback, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getConceptHistory } from '@/lib/kb/api/history'

const useLoadConceptHistory = () => {
  const { apiFns } = use(ConfigContext)
  const [history, setHistory] = useState([])

  const loadConceptHistory = useCallback(
    async conceptName => {
      if (!apiFns || !conceptName) return

      const result = await apiFns.apiPayload(getConceptHistory, conceptName)
      setHistory(result)
    },
    [apiFns]
  )

  return { history, loadConceptHistory }
}

export default useLoadConceptHistory
