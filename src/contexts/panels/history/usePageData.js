import { use, useCallback } from 'react'

import { getHistory } from '@/lib/api/history'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { CONCEPT } from '@/lib/constants'
import { SELECTED } from '@/lib/constants/selected.js'

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

  const textSort = (sortData, field) => {
    return sortData.sort((a, b) => {
      return (a[field] || '').localeCompare(b[field] || '', undefined, { sensitivity: 'base' })
    })
  }

  const timestampSort = (sortData, field) => {
    return sortData.sort((a, b) => {
      return new Date(a[field]) - new Date(b[field])
    })
  }

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
          const sortData = [...conceptState.data]
          if (sortField === 'creationTimestamp') {
            sorted = timestampSort(sortData, 'creationTimestamp')
          } else if (sortField === 'field') {
            sorted = textSort(sortData, 'field')
          } else if (sortField === 'action') {
            sorted = textSort(sortData, 'action')
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
