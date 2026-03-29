import useHistorySelection from '@/contexts/selected/useHistorySelection'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import { use, useMemo } from 'react'

const useConceptSelection = onCurrentChange => {
  const { rootName } = use(TaxonomyContext)

  const historySelection = useHistorySelection(rootName, onCurrentChange)

  return useMemo(
    () => ({
      ...historySelection,

      removeName: name => {
        const newState = historySelection
          .getState()
          .filter(item => item !== name)
          .filter((item, index, arr) => index === 0 || item !== arr[index - 1])

        historySelection.clear()
        newState.forEach(n => historySelection.push(n))
      },
    }),
    [historySelection]
  )
}

export default useConceptSelection
