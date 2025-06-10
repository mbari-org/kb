import useHistorySelect from '@/contexts/selected/useHistorySelect'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import { createConceptStore } from '@/lib/store/conceptStore'
import { use } from 'react'

const useConceptSelected = () => {
  const { getRootName } = use(TaxonomyContext)
  return useHistorySelect(createConceptStore, getRootName)
}

export default useConceptSelected
