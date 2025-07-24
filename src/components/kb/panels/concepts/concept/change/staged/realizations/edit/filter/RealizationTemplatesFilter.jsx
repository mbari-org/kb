import { useMemo } from 'react'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'
import RealizationTemplate from './RealizationTemplate'
import useAvailableLinkTemplates from '../useAvailableLinkTemplates'

const RealizationTemplatesFilter = ({ isLoading, linkName, onTemplateSelect }) => {
  const getAvailableLinkTemplates = useAvailableLinkTemplates()

  const availableTemplates = useMemo(() => {
    return getAvailableLinkTemplates(linkName)
  }, [getAvailableLinkTemplates, linkName])

  const renderItem = {
    key: (template, index) => `${template.concept}-${template.linkName}-${index}`,
    content: template => (
      <RealizationTemplate template={template} onTemplateSelect={onTemplateSelect} />
    ),
  }

  return (
    <ConceptPropertiesSection
      fixedHeight={180}
      items={availableTemplates}
      isLoading={isLoading}
      loadingText='Loading templates...'
      renderItem={renderItem}
      title='Available Templates'
    />
  )
}

export default RealizationTemplatesFilter
