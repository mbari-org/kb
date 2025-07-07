import { use, useMemo } from 'react'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'
import RealizationTemplate from './RealizationTemplate'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

const RealizationTemplatesFilter = ({ onTemplateSelect, linkNameFilter }) => {
  const { isLoading, templates } = use(PanelDataContext)
  const { concept } = use(ConceptContext)
  const { getAncestors } = use(TaxonomyContext)

  // Filter templates for current concept and by linkName (using available logic like Templates panel)
  const availableTemplates = useMemo(() => {
    if (!concept || !templates) return []

    // Get all available concepts (current concept + ancestors) like Templates panel does when Available=true
    const ancestors = getAncestors(concept.name)
    const allConcepts = [concept.name, ...ancestors]

    // Use the same filterTemplates utility as Templates panel
    return filterTemplates(templates, {
      concepts: allConcepts,
      linkName: linkNameFilter
    })
  }, [templates, concept, linkNameFilter, getAncestors])

  const renderItem = {
    key: (template, index) => `${template.concept}-${template.linkName}-${index}`,
    content: template => (
      <RealizationTemplate template={template} onTemplateSelect={onTemplateSelect} />
    ),
  }

  return (
    <ConceptPropertiesSection
      alwaysExpanded={true}
      isLoading={isLoading}
      items={availableTemplates}
      loadingText='Loading templates...'
      renderItem={renderItem}
      title='Available Templates'
    />
  )
}

export default RealizationTemplatesFilter
