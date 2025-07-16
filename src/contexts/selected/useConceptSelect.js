import useHistorySelect from '@/contexts/selected/useHistorySelect'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import { createConceptStore } from '@/lib/store/conceptStore'
import { use } from 'react'

const useConceptSelected = () => {
  const { getRootName } = use(TaxonomyContext)

  const conceptSelect = useHistorySelect(createConceptStore, getRootName)

  conceptSelect.removeName = name => {
    const newState = conceptSelect
      .getState()
      .filter(item => item !== name)
      .filter((item, index, arr) => index === 0 || item !== arr[index - 1])

    conceptSelect.clear()
    newState.forEach(name => conceptSelect.push(name))
  }

  return conceptSelect
}

export default useConceptSelected
