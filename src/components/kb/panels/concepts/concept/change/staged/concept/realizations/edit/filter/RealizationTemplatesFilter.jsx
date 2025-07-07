import { use, useMemo } from 'react'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'
import RealizationTemplate from './RealizationTemplate'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const RealizationTemplatesFilter = ({ onTemplateSelect }) => {
  const { isLoading, templates } = use(PanelDataContext)
  const { concept } = use(ConceptContext)
  
  // Filter templates for current concept
  const availableTemplates = useMemo(() => {
    if (!concept || !templates) return []
    return templates.filter(template => template.concept === concept.name)
  }, [templates, concept])
  
  const renderItem = {
    key: (template, index) => `${template.concept}-${template.linkName}-${index}`,
    content: template => <RealizationTemplate template={template} onTemplateSelect={onTemplateSelect} />,
  }
  
  return (
    <ConceptPropertiesSection
      isLoading={isLoading}
      items={availableTemplates}
      loadingText='Loading templates...'
      renderItem={renderItem}
      title='Available Templates'
    />
  )
}

export default RealizationTemplatesFilter
