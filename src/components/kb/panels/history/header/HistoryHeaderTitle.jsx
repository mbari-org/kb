import { use } from 'react'

import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import HistoryContext from '@/contexts/panels/history/HistoryContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import CONFIG from '@/text'
import { CONCEPT, SELECTED } from '@/lib/constants'

const { TYPE } = CONCEPT.HISTORY
const { EXTENT } = CONCEPT
const { CONCEPT: SELECTED_CONCEPT } = SELECTED

const HistoryHeaderTitle = () => {
  const { selectedType, conceptState } = use(HistoryContext)
  const { getSelected } = use(SelectedContext)
  const title = CONFIG.PANELS.HISTORY.PANEL.NAME

  let subtitle
  if (selectedType === TYPE.CONCEPT) {
    const conceptName = getSelected(SELECTED_CONCEPT)
    const extent = conceptState.extent

    if (extent === EXTENT.CHILDREN || extent === EXTENT.DESCENDANTS) {
      const extentText = CONFIG.PANELS.HISTORY.EXTENT[extent.toUpperCase()]
      subtitle = `${conceptName} and ${extentText}`
    } else {
      subtitle = conceptName
    }
  } else {
    subtitle = CONFIG.PANELS.HISTORY.TYPE[selectedType.toUpperCase()]
  }

  return <PanelHeaderTitle subtitle={subtitle} title={title} />
}

export default HistoryHeaderTitle
