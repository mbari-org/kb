import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

const TemplatesHeaderLeft = () => {
  const { getNames } = use(TaxonomyContext)
  const { available, filterConcept, handleConceptFilter, explicitConcepts } = use(TemplatesContext)

  const selectables = available ? getNames() : explicitConcepts

  return (
    <ConceptSelect
      conceptName={filterConcept}
      doConceptSelected={handleConceptFilter}
      selectables={selectables}
      updateConceptSelected={false}
    />
  )
}

export default TemplatesHeaderLeft
