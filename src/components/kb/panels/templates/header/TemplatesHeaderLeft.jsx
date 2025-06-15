import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

const TemplatesHeaderLeft = () => {
  const { filterConcept, handleConceptFilter, selectableConcepts } = use(TemplatesContext)

  const handleConceptSelect = selector => conceptName => {
    selector(conceptName)
    return false
  }

  return (
    <ConceptSelect
      conceptName={filterConcept}
      doConceptSelect={handleConceptSelect(handleConceptFilter)}
      navigation={false}
      selectables={selectableConcepts}
    />
  )
}

export default TemplatesHeaderLeft
