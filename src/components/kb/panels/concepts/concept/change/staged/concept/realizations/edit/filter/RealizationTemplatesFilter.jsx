import { use, useMemo } from 'react'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'
import RealizationTemplate from './RealizationTemplate'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

const RealizationTemplatesFilter = ({ onTemplateSelect, linkNameFilter }) => {
  const { isLoading, templates } = use(PanelDataContext)
  const { concept } = use(ConceptContext)
  
  // Filter templates for current concept and by linkName
  const availableTemplates = useMemo(() => {
    if (!concept || !templates) return []
    
    // First filter by concept
    const conceptTemplates = templates.filter(template => template.concept === concept.name)
    
    // Then apply linkName filter if provided
    if (linkNameFilter) {
      return filterTemplates(conceptTemplates, { linkName: linkNameFilter })
    }
    
    return conceptTemplates
  }, [templates, concept, linkNameFilter])
  
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
