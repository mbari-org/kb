import { use } from 'react'
import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import CONFIG from '@/lib/config'
import { CONCEPT } from '@/lib/constants'

import { SELECTED } from '@/lib/constants/selected.js'

const { REFERENCES: SETTINGS } = SELECTED.SETTINGS
const PANEL = CONFIG.PANELS.REFERENCES.PANEL
const ALL_CONCEPTS = PANEL.SUBTITLE.ALL_CONCEPTS
const FILTERS = SETTINGS.FILTERS

const ReferencesHeaderTitle = () => {
  const { conceptExtent, filters } = use(ReferencesContext)
  const conceptName = filters[FILTERS.CONCEPT]

  const title = PANEL.NAME
  let subtitle = ALL_CONCEPTS
  if (conceptName) {
    switch (conceptExtent) {
      case CONCEPT.EXTENT.CHILDREN:
        subtitle = `${conceptName} and children`
        break
      case CONCEPT.EXTENT.DESCENDANTS:
        subtitle = `${conceptName} and descendants`
        break
      default:
        subtitle = conceptName
    }
  }
  const hasTextFilter = Boolean(filters[FILTERS.CITATION]?.trim() || filters[FILTERS.CONCEPTS]?.trim())
  if (hasTextFilter) {
    subtitle = `${subtitle} (filtered)`
  }

  return <PanelHeaderTitle subtitle={subtitle} title={title} />
}

export default ReferencesHeaderTitle
