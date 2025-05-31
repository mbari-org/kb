import { use, useEffect, useState } from 'react'

import { getReferences } from '@/lib/kb/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'

const useLoadReferences = () => {
  const { apiFns } = use(ConfigContext)
  const [references, setReferences] = useState([])

  useEffect(() => {
    const fetchReferences = async () => {
      const { data, count } = await apiFns.apiPagination(getReferences)
      setReferences(data)
      // setCount(count)
    }

    fetchReferences()
  }, [apiFns])

  return { references }
}

export default useLoadReferences
