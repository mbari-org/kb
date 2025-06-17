import HistoryHeaderLeft from '@/components/kb/panels/history/header/HistoryHeaderLeft'
import HistoryHeaderRight from '@/components/kb/panels/history/header/HistoryHeaderRight'
import HistoryHeaderTitle from '@/components/kb/panels/history/header/HistoryHeaderTitle'
import HistoryTableHeaderLeft from '@/components/kb/panels/history/table/header/HistoryTableHeaderLeft'
import HistoryTableHeaderRight from '@/components/kb/panels/history/table/header/HistoryTableHeaderRight'
import HistoryTableTypeData from '@/components/kb/panels/history/table/data/HistoryTableTypeData'
import HistoryTableConceptData from '@/components/kb/panels/history/table/data/HistoryTableConceptData'
import useHistoryColumns from '@/components/kb/panels/history/useHistoryColumns'

import useTablePanel from '@/components/common/panel/useTablePanel'
import HistoryContext from '@/contexts/panels/history/HistoryContext'
import { use } from 'react'

const HistoryPanel = () => {
  const { createTablePanel } = useTablePanel()
  const { selectedType } = use(HistoryContext)
  const columns = useHistoryColumns({ type: selectedType })

  // Choose the appropriate table data component based on the selected type
  const TableDataComponent =
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
      content: <TableDataComponent columns={columns} />,
    },
  })
}

export default HistoryPanel
