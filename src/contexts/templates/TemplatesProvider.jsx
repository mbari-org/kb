import { use, useEffect, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import TemplatesContext from './TemplatesContext'

import { getLinkTemplates, getLinkTemplatesCount } from '@/lib/api/linkTemplates'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.TEMPLATES.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const TemplatesProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)

  const [count, setCount] = useState(0)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)
  const [templates, setTemplates] = useState([])

  useEffect(() => {
    const loadData = async () => {
      if (!apiFns) return

      const [count, templates] = await Promise.all([
        apiFns.apiResult(getLinkTemplatesCount),
        apiFns.apiPaginated(getLinkTemplates, { limit, offset }),
      ])

      setCount(count)
      setTemplates(templates)
    }
    loadData()
  }, [apiFns, limit, offset])

  const nextPage = () => {
    setOffset(prev => prev + limit)
  }

  const prevPage = () => {
    setOffset(prev => Math.max(0, prev - limit))
  }

  const setPageSize = newLimit => {
    setLimit(newLimit)
    setOffset(0) // Reset to first page when changing page size
  }

  const value = {
    count,
    limit,
    nextPage,
    offset,
    prevPage,
    setPageSize,
    templates,
  }

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>
}

export default TemplatesProvider
