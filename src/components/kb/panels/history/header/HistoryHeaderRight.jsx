import { use } from 'react'

import HistoryHeaderToggle from './HistoryHeaderToggle'

import SelectedContext from '@/contexts/selected/SelectedContext'

import CONFIG from '@/text'
import { SELECTED } from '@/lib/constants/selected.js'

const { HISTORY } = SELECTED.SETTINGS

const HistoryHeaderRight = () => {
  const { updateSettings } = use(SelectedContext)

  const handleHistorySelection = (_, historyType) =>
    !!historyType && updateSettings({ [HISTORY.KEY]: { [HISTORY.TYPE]: historyType } })

  const tooltips = CONFIG.PANELS.HISTORY.TOOLTIP.TYPE

  return <HistoryHeaderToggle onChange={handleHistorySelection} tooltips={tooltips} />
}

export default HistoryHeaderRight
