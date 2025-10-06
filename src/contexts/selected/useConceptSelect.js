import useHistorySelect from '@/contexts/selected/useHistorySelect'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import { use, useMemo } from 'react'

const useConceptSelect = onCurrentChange => {
  const { getRootName } = use(TaxonomyContext)

  const historySelect = useHistorySelect(
    getRootName,
    onCurrentChange
  )

  return useMemo(() => ({
    ...historySelect,

    removeName: name => {
      const newState = historySelect.getState()
        .filter(item => item !== name)
        .filter((item, index, arr) => index === 0 || item !== arr[index - 1])

      historySelect.clear()
      newState.forEach(n => historySelect.push(n))
    },
  }), [historySelect])
}

export default useConceptSelect
