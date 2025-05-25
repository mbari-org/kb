import { use, useEffect, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getHistoryCount } from '@/lib/kb/api/history'

const useHistoryCount = type => {
  const { apiFns } = use(ConfigContext)

  const [count, setCount] = useState(0)

  useEffect(() => {
    const loadCount = async () => {
      if (!apiFns) return

      const { error, count } = await apiFns.apiResult(getHistoryCount, type)
      if (error) {
        throw new Error(`${error.title}: ${error.message}\n${error.detail}`)
      }
      setCount(count)
    }
    loadCount()
  }, [type])

  return count
}

export default useHistoryCount
