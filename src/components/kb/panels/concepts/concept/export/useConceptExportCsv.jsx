import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_EXTENT } from '@/lib/constants'

const useConceptExportCsv = ({ conceptExtent }) => {
  const { concept, conceptPath } = use(ConceptContext)

  let headers = ['id', 'parentId', 'names']

  const getData = () => {
    return []
  }

}

export default useConceptExportCsv