import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import useHistoryExport from '@/components/kb/panels/history/table/header/useHistoryExport'

import CONFIG from '@/text'

const HistoryTableHeaderLeft = () => {
  const { count, selectedType } = use(HistoryContext)

  const historyExport = useHistoryExport()

  const toolTip = CONFIG.PANELS.HISTORY.TOOLTIP.EXPORT[selectedType.toUpperCase()]

  return <PanelDataExport count={count} exportFn={historyExport} exportTooltip={toolTip} width='auto' />
}

export default HistoryTableHeaderLeft
