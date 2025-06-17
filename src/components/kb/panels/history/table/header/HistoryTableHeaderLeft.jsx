import { use } from 'react'

import PanelTotalExport from '@/components/common/panel/PanelTotalExport'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import useHistoryExport from '@/components/kb/panels/history/table/header/useHistoryExport'

const HistoryTableHeaderLeft = () => {
  const { count } = use(HistoryContext)

  const historyExport = useHistoryExport()

  return <PanelTotalExport count={count} exportFn={historyExport} />
}

export default HistoryTableHeaderLeft
