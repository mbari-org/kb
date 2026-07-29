import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import useHistoryExport from '@/components/kb/panels/history/table/header/useHistoryExport'

import CONFIG from '@/lib/config'

const { BUTTON } = CONFIG
const { TOOLTIP, TOTAL } = CONFIG.PANELS.HISTORY.EXPORT

const HistoryTableHeaderLeft = () => {
  const { conceptState } = use(HistoryContext)

  const historyExport = useHistoryExport()

  return (
    <PanelDataExport
      count={conceptState.count}
      countLabel={TOTAL}
      exportButtonLabel={BUTTON.EXPORT}
      exportFn={historyExport}
      exportTooltip={TOOLTIP.EXPORT}
      width='auto'
    />
  )
}

export default HistoryTableHeaderLeft
