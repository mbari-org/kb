import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import { getTemplates, getTemplatesCount } from '@/lib/api/linkTemplates'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.TEMPLATES.DEFAULT_LIMIT

const useLoadTemplateData = () => {
  const { apiFns } = use(ConfigContext)

  const loadTemplateData = useCallback(
    async ({ limit = DEFAULT_LIMIT, offset = 0 }) => {
      if (!apiFns) return { count: 0, templates: [] }

      const [count, templates] = await Promise.all([
        apiFns.apiResult(getTemplatesCount),
        apiFns.apiPaginated(getTemplates, { limit, offset }),
      ])

      return { count, templates }
    },
    [apiFns]
  )

  return loadTemplateData
}

export default useLoadTemplateData
