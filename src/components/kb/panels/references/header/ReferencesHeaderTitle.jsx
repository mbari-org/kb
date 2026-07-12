import { use } from 'react'
import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import SelectedContext from '@/contexts/selected/SelectedContext'

import CONFIG from '@/text'
import { CONCEPT } from '@/lib/constants'

import { SELECTED } from '@/lib/constants/selected.js'

const { REFERENCES } = SELECTED.SETTINGS

const ReferencesHeaderTitle = () => {
  const { conceptExtent } = use(ReferencesContext)
  const { getSelected, getSettings } = use(SelectedContext)
  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)
  const conceptName = byConcept ? getSelected(SELECTED.CONCEPT) : null

  const title = CONFIG.PANELS.REFERENCES.PANEL.NAME
  let subtitle
  switch (conceptExtent) {
    case CONCEPT.EXTENT.CHILDREN:
      subtitle = conceptName ? `${conceptName} and children` : CONFIG.PANELS.REFERENCES.PANEL.SUBTITLE.ALL_CONCEPTS
      break
    case CONCEPT.EXTENT.DESCENDANTS:
      subtitle = conceptName ? `${conceptName} and descendants` : CONFIG.PANELS.REFERENCES.PANEL.SUBTITLE.ALL_CONCEPTS
      break
    default:
      subtitle = conceptName || CONFIG.PANELS.REFERENCES.PANEL.SUBTITLE.ALL_CONCEPTS
  }

  return (
    <PanelHeaderTitle
      subtitle={subtitle}
      title={title}
    />
  )
}

export default ReferencesHeaderTitle