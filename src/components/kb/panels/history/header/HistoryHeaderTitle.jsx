import { use } from 'react'

import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import { capitalize } from '@/lib/utils'

const HistoryHeaderTitle = () => {
  const { selectedType } = use(HistoryContext)
  const title = `${capitalize(selectedType)} History`

  return <PanelHeaderTitle title={title} />
}

export default HistoryHeaderTitle
