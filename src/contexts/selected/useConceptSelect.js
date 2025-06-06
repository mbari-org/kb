import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import useHistorySelect from '@/hooks/useHistorySelect'
import { createConceptStore } from '@/lib/store/conceptStore'
import { use } from 'react'

const useSelectedConcept = () => {
  const { getRootName } = use(TaxonomyContext)
  return useHistorySelect(createConceptStore, getRootName)
}

export default useSelectedConcept
