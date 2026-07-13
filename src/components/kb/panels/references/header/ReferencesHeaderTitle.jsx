import { use } from 'react'
import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import SelectedContext from '@/contexts/selected/SelectedContext'

import CONFIG from '@/text'
import { CONCEPT } from '@/lib/constants'

import { SELECTED } from '@/lib/constants/selected.js'

const { REFERENCES: SETTINGS } = SELECTED.SETTINGS
const PANEL = CONFIG.PANELS.REFERENCES.PANEL
const ALL_CONCEPTS = PANEL.SUBTITLE.ALL_CONCEPTS

const ReferencesHeaderTitle = () => {
  const { conceptExtent } = use(ReferencesContext)
  const { getSelected, getSettings } = use(SelectedContext)
  const byConcept = getSettings(SETTINGS.KEY, SETTINGS.BY_CONCEPT)
  const conceptName = byConcept ? getSelected(SELECTED.CONCEPT) : null

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

  return <PanelHeaderTitle subtitle={subtitle} title={title} />
}

export default ReferencesHeaderTitle
