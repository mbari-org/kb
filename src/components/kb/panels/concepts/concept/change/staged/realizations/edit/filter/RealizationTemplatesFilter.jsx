import { useMemo } from 'react'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'
import RealizationTemplate from './RealizationTemplate'

const RealizationTemplatesFilter = ({
  availableLinkTemplates,
  isLoading,
  linkName,
  onTemplateSelect,
}) => {
  const availableTemplates = useMemo(() => {
    return availableLinkTemplates(linkName)
  }, [availableLinkTemplates, linkName])

  const renderItem = {
    key: (template, index) => `${template.concept}-${template.linkName}-${index}`,
    content: template => (
      <RealizationTemplate template={template} onTemplateSelect={onTemplateSelect} />
    ),
  }

  return (
    <ConceptPropertiesSection
      fixedHeight={160}
      items={availableTemplates}
      isLoading={isLoading}
      loadingText='Loading templates...'
      renderItem={renderItem}
      title='Available Templates'
    />
  )
}

export default RealizationTemplatesFilter
