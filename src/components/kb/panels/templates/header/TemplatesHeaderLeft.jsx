import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

const TemplatesHeaderLeft = () => {
  const { getNames } = use(TaxonomyContext)
  const { available, filterConcept, handleConceptFilter, templateConcepts } = use(TemplatesContext)

  const selectables = available ? getNames() : templateConcepts

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
