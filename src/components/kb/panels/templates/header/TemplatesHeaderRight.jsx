import { use } from 'react'

import ToConceptSelect from '@/components/common/concept/ToConceptSelect'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

const TemplatesHeaderRight = () => {
  const { filterToConcept, handleToConceptFilter } = use(TemplatesContext)

  const handleConceptSelect = selector => conceptName => {
    selector(conceptName)
    return false
  }
  return (
    <ToConceptSelect
      conceptName={filterToConcept}
      doConceptSelect={handleConceptSelect(handleToConceptFilter)}
    />
  )
}

export default TemplatesHeaderRight
