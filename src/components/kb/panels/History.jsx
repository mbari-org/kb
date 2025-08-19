import { use } from 'react'

import HistoryHeaderLeft from '@/components/kb/panels/history/header/HistoryHeaderLeft'
import HistoryHeaderRight from '@/components/kb/panels/history/header/HistoryHeaderRight'
import HistoryHeaderTitle from '@/components/kb/panels/history/header/HistoryHeaderTitle'
import HistoryTableConceptData from '@/components/kb/panels/history/table/data/HistoryTableConceptData'
import HistoryTableHeaderLeft from '@/components/kb/panels/history/table/header/HistoryTableHeaderLeft'
import HistoryTableHeaderRight from '@/components/kb/panels/history/table/header/HistoryTableHeaderRight'
import HistoryTableTypeData from '@/components/kb/panels/history/table/data/HistoryTableTypeData'

import usePanelFactory from '@/components/common/panel/usePanelFactory'

import HistoryContext from '@/contexts/panels/history/HistoryContext'
import HistoryProvider from '@/contexts/panels/history/HistoryProvider'

const HistoryContent = () => {
  const { createTablePanel } = usePanelFactory()
  const { selectedType } = use(HistoryContext)

  const historyTableDataComponent =
    selectedType === 'concept' ? <HistoryTableConceptData /> : <HistoryTableTypeData />

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
      content: historyTableDataComponent,
    },
  })
}

const History = () => {
  return (
    <HistoryProvider>
      <HistoryContent />
    </HistoryProvider>
  )
}

export default History
