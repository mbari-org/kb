import { use } from 'react'

import HistoryHeaderToggle from './HistoryHeaderToggle'

import SelectedContext from '@/contexts/selected/SelectedContext'

const HistoryHeaderRight = () => {
  const { select } = use(SelectedContext)

  const handleHistorySelection = (_, newSelection) =>
    !!newSelection && select({ history: newSelection })

  return <HistoryHeaderToggle onChange={handleHistorySelection} />
}

export default HistoryHeaderRight
