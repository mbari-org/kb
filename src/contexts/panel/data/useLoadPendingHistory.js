import { useCallback } from 'react'

import { getHistory, getHistoryCount } from '@/lib/kb/api/history'

import { PAGINATION } from '@/lib/constants/constants'

import { pendingActionText } from '@/lib/kb/model/history'

const { HISTORY } = PAGINATION

export const useLoadPendingHistory = apiFns => {
  const loadPendingHistory = useCallback(async () => {
    const EXPORT_PAGE_SIZE = HISTORY.EXPORT_PAGE_SIZE

    const totalCount = await apiFns.apiResult(getHistoryCount, 'pending')
    if (!totalCount) return []

    const historyPerPage = EXPORT_PAGE_SIZE
    const totalPages = Math.ceil(totalCount / historyPerPage)

    const pageIndices = Array.from({ length: totalPages }, (_, i) => i)

    const allPendingHistory = await pageIndices.reduce(async (accPromise, pageIndex) => {
      const acc = await accPromise
      const pagePendingHistory = await apiFns.apiPaginated(getHistory, [
        'pending',
        {
          limit: historyPerPage,
          offset: pageIndex * historyPerPage,
        },
      ])
      acc.push(...pagePendingHistory)
      return acc
    }, Promise.resolve([]))

    return allPendingHistory.map(history => {
      return {
        ...history,
        action: pendingActionText(history.action),
      }
    })
  }, [apiFns])

  return loadPendingHistory
}

export default useLoadPendingHistory
