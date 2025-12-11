import { use } from 'react'
import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import SelectedContext from '@/contexts/selected/SelectedContext'

import CONFIG from '@/config'

import { SELECTED } from '@/lib/constants/selected.js'

const { REFERENCES } = SELECTED.SETTINGS

const ReferencesHeaderTitle = () => {
  const { getSelected, getSettings } = use(SelectedContext)
  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)
  const conceptName = byConcept ? getSelected(SELECTED.CONCEPT) : null

  const title = CONFIG.PANELS.REFERENCES.PANEL.NAME
  const subtitle = conceptName || CONFIG.PANELS.REFERENCES.PANEL.SUBTITLE.ALL_CONCEPTS

  return (
    <PanelHeaderTitle
      subtitle={subtitle}
      title={title}
    />
  )
}

export default ReferencesHeaderTitle