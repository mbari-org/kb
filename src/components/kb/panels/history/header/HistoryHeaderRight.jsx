import { use } from 'react'

import HistoryHeaderToggle from './HistoryHeaderToggle'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/kb/constants/selected.js'

const { HISTORY } = SELECTED.SETTINGS

const HistoryHeaderRight = () => {
  const { updateSettings } = use(SelectedContext)

  const handleHistorySelection = (_, historyType) =>
    !!historyType && updateSettings({ [HISTORY.KEY]: { [HISTORY.TYPE]: historyType } })

  return <HistoryHeaderToggle onChange={handleHistorySelection} />
}

export default HistoryHeaderRight
