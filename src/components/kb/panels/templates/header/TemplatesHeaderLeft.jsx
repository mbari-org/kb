import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

const TemplatesHeaderLeft = () => {
  const { filterConcept, handleConceptFilter, selectableConcepts } = use(TemplatesContext)

  return (
    <ConceptSelect
      conceptName={filterConcept}
      doConceptSelected={handleConceptFilter}
      selectables={selectableConcepts}
      updateConceptSelected={false}
    />
  )
}

export default TemplatesHeaderLeft
