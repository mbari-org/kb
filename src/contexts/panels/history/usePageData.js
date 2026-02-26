import { use, useCallback } from 'react'

import { getHistory } from '@/lib/api/history'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'
import { CONCEPT } from '@/lib/constants'

const { TYPE } = CONCEPT.HISTORY
const { HISTORY } = SELECTED.SETTINGS

const usePageData = ({
  apiFns,
  conceptState,
  pageState,
}) => {
  const { getSettings } = use(SelectedContext)

  const selectedType = getSettings(HISTORY.KEY, HISTORY.TYPE)

  const { limit, offset, sortField, sortOrder } = pageState

  const pageData = useCallback(
    async ({ updatePageState }) => {
      if (!apiFns) return

      let data = []
      if (selectedType === TYPE.APPROVED) {
        data = await apiFns.apiPaginated(getHistory, [
          selectedType,
          {
            limit,
            offset,
            sort: `${sortField},${sortOrder}`,
          },
        ])
      } else {
        let sorted = conceptState.data

        if (selectedType === TYPE.PENDING) {
          if (sortField === 'creationTimestamp') {
            sorted = [...conceptState.data].sort((a, b) => {
              return new Date(a.creationTimestamp) - new Date(b.creationTimestamp)
            })
          } else if (sortField === 'field') {
            sorted = [...conceptState.data].sort((a, b) => {
              return (a.field || '').localeCompare(b.field || '', undefined, { sensitivity: 'base' })
            })
          } else if (sortField === 'action') {
            sorted = [...conceptState.data].sort((a, b) => {
              return (a.action || '').localeCompare(b.action || '', undefined, { sensitivity: 'base' })
            })
          }

          if (sortOrder === 'desc') {
            sorted.reverse()
          }
        }

        const start = offset
        const end = start + limit
        data = sorted.slice(start, end)
      }
      updatePageState({ data })
    },
    [apiFns, conceptState.data, selectedType, sortField, sortOrder, limit, offset]
  )

  return pageData
}

export default usePageData
