import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import useHistoryExport from '@/components/kb/panels/history/table/header/useHistoryExport'

import { HISTORY } from '@/lib/constants'

const HistoryTableHeaderLeft = () => {
  const { count, selectedType } = use(HistoryContext)

  const historyExport = useHistoryExport()

  const toolTip = HISTORY.EXPORT[selectedType.toUpperCase()]

  return <PanelDataExport count={count} exportFn={historyExport} exportToolTip={toolTip} width='auto' />
}

export default HistoryTableHeaderLeft
