import { use } from 'react'

import Title from '@/components/common/factory/Title'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { SELECTED } from '@/lib/constants/selected.js'

const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES

const TemplateTitle = () => {
  const { filters } = use(TemplatesContext)
  const conceptName = filters[FILTERS.CONCEPT]

  if (!conceptName) return <Title title='Concept: Loading...' />

  return <Title title={`Concept: ${conceptName}`} />
}

export default TemplateTitle
