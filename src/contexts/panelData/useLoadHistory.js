import { useCallback } from 'react'

import { getHistory } from '@/lib/api/history'

/**
 * Hook for loading history data (both approved and pending)
 * @param {Object} apiFns - API functions from ConfigContext
 * @returns {Function} loadHistory function
 */
const useLoadHistory = apiFns => {
  const loadHistory = useCallback(async () => {
    const [approved, pending] = await Promise.all([
      apiFns.apiPaginated(getHistory, ['approved']),
      apiFns.apiPaginated(getHistory, ['pending']),
    ])

    return { approved, pending }
  }, [apiFns])

  return loadHistory
}

export default useLoadHistory
