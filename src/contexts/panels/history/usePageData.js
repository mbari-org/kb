import { use, useCallback } from 'react'

import { getHistory } from '@/lib/api/history'

import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'

import { CONCEPT } from '@/lib/constants'
import { FIELDS } from '@/lib/config/fields.js'
import { SELECTED } from '@/lib/constants/selected.js'

const { TYPE } = CONCEPT.HISTORY
const { HISTORY } = SELECTED.SETTINGS
const { ACTION, CONCEPT: CONCEPT_FIELD, CREATION_TIMESTAMP, CREATOR_NAME, FIELD, NEW_VALUE, OLD_VALUE } =
  FIELDS.HISTORY

const usePageData = ({
  apiFns,
  conceptState,
  pageState,
}) => {
  const { getSettings } = use(SelectedSettingsContext)

  const selectedType = getSettings(HISTORY.KEY, HISTORY.TYPE)
  const historySort = getSettings(HISTORY.KEY, HISTORY.SORT.KEY)
  const { field: sortField, order: sortOrder } = historySort?.[selectedType] || HISTORY.SORT.DEFAULT

  const { limit, offset } = pageState

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

      let data
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
          switch (sortField) {
            case CREATION_TIMESTAMP:
              sorted = timestampSort(sortData, CREATION_TIMESTAMP)
              break

            case FIELD:
              sorted = textSort(sortData, FIELD)
              break

            case ACTION:
              sorted = textSort(sortData, ACTION)
              break

            case CONCEPT_FIELD:
              sorted = textSort(sortData, CONCEPT_FIELD)
              break

            case CREATOR_NAME:
              sorted = textSort(sortData, CREATOR_NAME)
              break

            case OLD_VALUE:
              sorted = textSort(sortData, OLD_VALUE)
              break

            case NEW_VALUE:
              sorted = textSort(sortData, NEW_VALUE)
              break
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
