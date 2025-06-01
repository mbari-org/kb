import { use, useEffect, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getHistoryCount } from '@/lib/kb/api/history'

const useHistoryCount = type => {
  const { apiFns } = use(ConfigContext)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const loadCount = async () => {
      if (!apiFns) return

      const count = await apiFns.apiResult(getHistoryCount, type)
      setCount(count)
    }
    loadCount()
  }, [apiFns, type])

  return count
}

export default useHistoryCount
