import { use } from 'react'

import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import { capitalize } from '@/lib/utils'

const HistoryHeaderTitle = () => {
  const { selectedType } = use(HistoryContext)

  return <PanelHeaderTitle title={capitalize(selectedType)} />
}

export default HistoryHeaderTitle
