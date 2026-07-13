import { use } from 'react'
import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'
import SelectedContext from '@/contexts/selected/SelectedContext'

import CONFIG from '@/text'
import { SELECTED } from '@/lib/constants/selected.js'

const PANEL = CONFIG.PANELS.REALIZATIONS.PANEL

const RealizationsHeaderTitle = () => {
  const { getSelected } = use(SelectedContext)
  const conceptName = getSelected(SELECTED.CONCEPT)

  const title = PANEL.NAME

  return <PanelHeaderTitle subtitle={conceptName} title={title} />
}

export default RealizationsHeaderTitle
