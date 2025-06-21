import { use } from 'react'

import HistoryHeaderLeft from '@/components/kb/panels/history/header/HistoryHeaderLeft'
import HistoryHeaderRight from '@/components/kb/panels/history/header/HistoryHeaderRight'
import HistoryHeaderTitle from '@/components/kb/panels/history/header/HistoryHeaderTitle'
import HistoryTableHeaderLeft from '@/components/kb/panels/history/table/header/HistoryTableHeaderLeft'
import HistoryTableHeaderRight from '@/components/kb/panels/history/table/header/HistoryTableHeaderRight'
import HistoryTableTypeData from '@/components/kb/panels/history/table/data/HistoryTableTypeData'
import HistoryTableConceptData from '@/components/kb/panels/history/table/data/HistoryTableConceptData'

import usePanelFactory from '@/components/common/panel/usePanelFactory'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

const HistoryPanel = () => {
  const { createTablePanel } = usePanelFactory()
  const { selectedType } = use(HistoryContext)

  const HistoryTableDataComponent =
    selectedType === 'concept' ? HistoryTableConceptData : HistoryTableTypeData

  return createTablePanel({
    header: {
      headerLeft: <HistoryHeaderLeft />,
      headerTitle: <HistoryHeaderTitle />,
      headerRight: <HistoryHeaderRight />,
    },
    tableHeader: {
      headerLeft: <HistoryTableHeaderLeft />,
      headerRight: <HistoryTableHeaderRight />,
    },
    tableData: {
      content: <HistoryTableDataComponent />,
    },
  })
}

export default HistoryPanel
