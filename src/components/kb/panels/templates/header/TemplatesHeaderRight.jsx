import { use } from 'react'

import ToConceptSelect from '@/components/common/concept/ToConceptSelect'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

const TemplatesHeaderRight = () => {
  const { filterToConcept, handleToConceptFilter } = use(TemplatesContext)

  return <ToConceptSelect conceptName={filterToConcept} doConceptSelected={handleToConceptFilter} />
}

export default TemplatesHeaderRight
