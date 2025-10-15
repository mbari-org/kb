import { use, useCallback } from 'react'

import { getHistory } from '@/lib/api/history'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { CONCEPT_HISTORY, SELECTED } from '@/lib/constants'

const { TYPE } = CONCEPT_HISTORY
const { HISTORY } = SELECTED.SETTINGS

const usePageData = ({
  apiFns,
  conceptState,
  pageState,
}) => {
  const { getSettings } = use(SelectedContext)

  const selectedType = getSettings(HISTORY.KEY, HISTORY.TYPE)

  const { limit, offset, sortOrder } = pageState

  const pageData = useCallback(
    async ({ updatePageState }) => {
      if (!apiFns) return

      let data = []
      if (selectedType === TYPE.APPROVED) {
        let actualOffset = offset
        if (sortOrder === 'desc') {
          const page = Math.floor(offset / limit)
          const totalPages = Math.ceil(conceptState.count / limit)
          const reversePage = totalPages - 1 - page
          actualOffset = reversePage * limit
        }
        data = await apiFns.apiPaginated(getHistory, [
          selectedType,
          { limit, offset: actualOffset },
        ])
      } else {
        const start = offset
        const end = start + limit
        data = conceptState.data.slice(start, end)
      }
      updatePageState({ data })
    },
    [apiFns, conceptState.data, conceptState.count, selectedType, sortOrder, limit, offset]
  )

  return pageData
}

export default usePageData
