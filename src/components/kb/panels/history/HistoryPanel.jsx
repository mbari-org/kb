import CxTBD from '@/components/common/CxTBD'

import HistoryHeaderLeft from '@/components/kb/panels/history/header/HistoryHeaderLeft'
import HistoryHeaderRight from '@/components/kb/panels/history/header/HistoryHeaderRight'
import HistoryHeaderTitle from '@/components/kb/panels/history/header/HistoryHeaderTitle'

import useTablePanel from '@/components/common/panel/useTablePanel'

const HistoryPanel = () => {
  const { createTablePanel } = useTablePanel()

  return createTablePanel({
    header: {
      headerLeft: <HistoryHeaderLeft />,
      headerTitle: <HistoryHeaderTitle />,
      headerRight: <HistoryHeaderRight />,
    },
    tableHeader: {
      headerLeft: <CxTBD text='History table header left' />,
      headerRight: <CxTBD text='History table header right' />,
    },
    tableData: {
      content: <CxTBD text='History table data' />,
    },
  })
}

export default HistoryPanel
