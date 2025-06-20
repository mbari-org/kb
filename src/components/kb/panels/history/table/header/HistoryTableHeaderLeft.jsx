import { use } from 'react'

import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import useHistoryExport from '@/components/kb/panels/history/table/header/useHistoryExport'

import { EXPORT } from '@/lib/tooltips'

const HistoryTableHeaderLeft = () => {
  const { count, selectedType } = use(HistoryContext)

  const historyExport = useHistoryExport()

  const toolTip = EXPORT.HISTORY[selectedType.toUpperCase()]

  return <PanelTotalExport count={count} exportFn={historyExport} toolTip={toolTip} />
}

export default HistoryTableHeaderLeft
