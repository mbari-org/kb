import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import TemplatesConceptAvailableTooltip from '@/components/kb/panels/templates/TemplatesConceptAvailableTooltip'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

const TemplatesHeaderLeft = () => {
  const { getNames } = use(TaxonomyContext)
  const { available, concept, explicitConcepts, setConcept } = use(TemplatesContext)

  const selectables = available ? getNames() : explicitConcepts

  return (
    <ConceptSelect
      conceptName={concept}
      doConceptSelected={conceptName => setConcept(conceptName)}
      selectables={selectables}
      tooltip={<TemplatesConceptAvailableTooltip />}
      updateConceptSelected={true}
    />
  )
}

export default TemplatesHeaderLeft
