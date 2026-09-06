import { use } from 'react'

import HistoryHeaderToggle from './HistoryHeaderToggle'

import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'

import CONFIG from '@/lib/config'
import { SELECTED } from '@/lib/constants/selected.js'

const { HISTORY } = SELECTED.SETTINGS

const HistoryHeaderRight = () => {
  const { updateSettings } = use(SelectedSettingsContext)

  const handleHistorySelection = (_, historyType) =>
    !!historyType && updateSettings({ [HISTORY.KEY]: { [HISTORY.TYPE]: historyType } })

  const tooltips = CONFIG.PANELS.HISTORY.PANEL.TOOLTIP.TYPE

  return <HistoryHeaderToggle onChange={handleHistorySelection} tooltips={tooltips} />
}

export default HistoryHeaderRight
