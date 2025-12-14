import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import useHistoryExport from '@/components/kb/panels/history/table/header/useHistoryExport'

import CONFIG from '@/text'

const HistoryTableHeaderLeft = () => {
  const { conceptState } = use(HistoryContext)

  const historyExport = useHistoryExport()

  const toolTip = CONFIG.PANELS.HISTORY.EXPORT.TOOLTIP.EXPORT
  const countLabel = CONFIG.PANELS.HISTORY.EXPORT.TOTAL
  const exportButtonLabel = CONFIG.PANELS.HISTORY.EXPORT.BUTTON.EXPORT

  return (
    <PanelDataExport
      count={conceptState.count}
      countLabel={countLabel}
      exportButtonLabel={exportButtonLabel}
      exportFn={historyExport}
      exportTooltip={toolTip}
      width='auto'
    />
  )
}

export default HistoryTableHeaderLeft
