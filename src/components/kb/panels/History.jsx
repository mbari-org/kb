import { use } from 'react'

import HistoryHeaderLeft from '@/components/kb/panels/history/header/HistoryHeaderLeft'
import HistoryHeaderRight from '@/components/kb/panels/history/header/HistoryHeaderRight'
import HistoryHeaderTitle from '@/components/kb/panels/history/header/HistoryHeaderTitle'
import HistoryTableConceptData from '@/components/kb/panels/history/table/data/HistoryTableConceptData'
import HistoryTableHeaderLeft from '@/components/kb/panels/history/table/header/HistoryTableHeaderLeft'
import HistoryTableHeaderConceptRight from '@/components/kb/panels/history/table/header/HistoryTableHeaderConceptRight'
import HistoryTableHeaderTypeRight from '@/components/kb/panels/history/table/header/HistoryTableHeaderTypeRight'
import HistoryTableTypeData from '@/components/kb/panels/history/table/data/HistoryTableTypeData'

import usePanelFactory from '@/components/common/panel/usePanelFactory'

import HistoryContext from '@/contexts/panels/history/HistoryContext'
import HistoryProvider from '@/contexts/panels/history/HistoryProvider'

import { CONCEPT_HISTORY } from '@/lib/constants'
const { TYPE } = CONCEPT_HISTORY

const HistoryContent = () => {
  const { createTablePanel } = usePanelFactory()
  const { selectedType } = use(HistoryContext)

  const dataContent =
    selectedType === TYPE.CONCEPT ? <HistoryTableConceptData /> : <HistoryTableTypeData />

  const headerRight =
    selectedType === TYPE.CONCEPT ? (
      <HistoryTableHeaderConceptRight />
    ) : (
      <HistoryTableHeaderTypeRight />
    )

  return createTablePanel({
    header: {
      headerLeft: <HistoryHeaderLeft />,
      headerTitle: <HistoryHeaderTitle />,
      headerRight: <HistoryHeaderRight />,
    },
    tableHeader: {
      headerLeft: <HistoryTableHeaderLeft />,
      headerRight: headerRight,
    },
    tableData: {
      content: dataContent,
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
