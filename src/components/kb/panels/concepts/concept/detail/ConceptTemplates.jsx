import { use, useMemo } from 'react'

import ConceptPropertyList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyList'
import ConceptTemplatesActionComponent from '@/components/kb/panels/concepts/concept/detail/templates/ConceptTemplatesActionComponent'
import ConceptTemplate from '@/components/kb/panels/concepts/concept/detail/templates/ConceptTemplate'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { isSame } from '@/lib/model/realization'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { SELECTED } from '@/lib/constants/selected.js'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { CONFIG } from '@/config/js/index.js'

const { TEMPLATES } = SELECTED.SETTINGS

const ConceptTemplates = () => {
  const { concept, stagedState } = use(ConceptContext)
  const { templates } = use(PanelDataContext)
  const { getSettings } = use(SelectedContext)
  const { getAncestorNames } = use(TaxonomyContext)

  const byAvailable = getSettings(TEMPLATES.KEY, TEMPLATES.BY_AVAILABLE)

  const TemplateComponent = ({ item }) => <ConceptTemplate template={item} />

  const templateItems = useMemo(() => {
    const ancestorNames = byAvailable ? getAncestorNames(concept.name) : []
    const concepts = concept.name ? [concept.name, ...ancestorNames] : null
    const filteredTemplates = filterTemplates(templates, { concepts })

    const actionTemplate = template =>
      stagedState?.templates?.find(stagedTemplate => isSame(template, stagedTemplate)) ||
     { ...template, action: CONCEPT_STATE.NO_ACTION }

    return filteredTemplates.map(template => actionTemplate(template))
  }, [byAvailable, concept.name, getAncestorNames, templates, stagedState?.templates])

  return (
    <ConceptPropertyList
      actionComponent={ConceptTemplatesActionComponent}
      items={templateItems}
      renderComponent={TemplateComponent}
      title={CONFIG.PANELS.CONCEPTS.TEMPLATES.LABEL}
    />
  )
}

export default ConceptTemplates
