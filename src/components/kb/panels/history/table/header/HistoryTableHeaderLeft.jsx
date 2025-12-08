import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import useHistoryExport from '@/components/kb/panels/history/table/header/useHistoryExport'

import { UI_TEXT } from '@/lib/constants/uiText.js'

const HistoryTableHeaderLeft = () => {
  const { count, selectedType } = use(HistoryContext)

  const historyExport = useHistoryExport()

  const toolTip = UI_TEXT.TOOLTIP.HISTORY.EXPORT[selectedType.toUpperCase()]

  return <PanelDataExport count={count} exportFn={historyExport} exportTooltip={toolTip} width='auto' />
}

export default HistoryTableHeaderLeft
