import { use } from 'react'

import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

const HistoryHeaderTitle = () => {
  const { selectedType } = use(HistoryContext)

  return <PanelHeaderTitle title={selectedType} />
}

export default HistoryHeaderTitle
