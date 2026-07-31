import { use } from 'react'
import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import CONFIG from '@/lib/config'

import { SELECTED } from '@/lib/constants'
import useFilterTooltip from '@/lib/hooks/useFilterTooltip'

const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES

const TemplatesHeaderTitle = () => {
  const { filterString, filters } = use(TemplatesContext)

  const title = CONFIG.PANELS.TEMPLATES.PANEL.NAME

  const filterTemplate = {
    concept: filters[FILTERS.CONCEPT],
    linkName: filters[FILTERS.LINK_NAME],
    toConcept: filters[FILTERS.TO_CONCEPT],
    linkValue: filters[FILTERS.LINK_VALUE],
  }

  const subtitle = filterString(filterTemplate)
  const subtitleTooltip = useFilterTooltip(filterTemplate)

  return <PanelHeaderTitle subtitle={subtitle} subtitleTooltip={subtitleTooltip} title={title} />
}

export default TemplatesHeaderTitle
