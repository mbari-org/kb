import { use, useEffect, useState } from 'react'

import { getReferences } from '@/lib/kb/api/references'

import ConfigContext from '@/contexts/config/ConfigContext'

const useLoadReferences = () => {
  const { config } = use(ConfigContext)
  const [references, setReferences] = useState([])

  useEffect(() => {
    const fetchReferences = async () => {
      const references = await getReferences(config)
      setReferences(references)
    }

    fetchReferences()
  }, [config])

  return { references }
}

export default useLoadReferences
