import { use, useEffect, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getLinkTemplateCount } from '@/lib/api/linkTemplates'

const useTemplateCount = type => {
  const { apiFns } = use(ConfigContext)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const loadCount = async () => {
      if (!apiFns) return

      const count = await apiFns.apiResult(getLinkTemplateCount, type)
      setCount(count)
    }
    loadCount()
  }, [apiFns, type])

  return count
}

export default useTemplateCount
