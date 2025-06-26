import { use } from 'react'

import ToConceptSelect from '@/components/common/concept/ToConceptSelect'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

const TemplatesHeaderRight = () => {
  const { toConcept, setToConcept } = use(TemplatesContext)

  return <ToConceptSelect conceptName={toConcept} doConceptSelected={setToConcept} />
}

export default TemplatesHeaderRight
