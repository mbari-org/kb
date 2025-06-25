import { use } from 'react'

import HistoryHeaderToggle from './HistoryHeaderToggle'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const { HISTORY } = SELECTED.SETTINGS

const HistoryHeaderRight = () => {
  const { updateSettings } = use(SelectedContext)

  const handleHistorySelection = (_, newSelection) =>
    !!newSelection && updateSettings({ [HISTORY.KEY]: { [HISTORY.TYPE]: newSelection } })

  return <HistoryHeaderToggle onChange={handleHistorySelection} />
}

export default HistoryHeaderRight
