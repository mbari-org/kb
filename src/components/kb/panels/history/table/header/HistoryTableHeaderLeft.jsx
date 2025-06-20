import { use } from 'react'

import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import useHistoryExport from '@/components/kb/panels/history/table/header/useHistoryExport'

import { HISTORY } from '@/lib/tooltips'

const HistoryTableHeaderLeft = () => {
  const { count, selectedType } = use(HistoryContext)

  const historyExport = useHistoryExport()

  const toolTip = HISTORY.EXPORT[selectedType.toUpperCase()]

  return <PanelTotalExport count={count} exportFn={historyExport} toolTip={toolTip} />
}

export default HistoryTableHeaderLeft
