
import RealizationsHeaderLeft from '@/components/kb/panels/realizations/header/RealizationsHeaderLeft'
import RealizationsHeaderRight from '@/components/kb/panels/realizations/header/RealizationsHeaderRight'
import RealizationsHeaderTitle from '@/components/kb/panels/realizations/header/RealizationsHeaderTitle'
import RealizationsTableData from '@/components/kb/panels/realizations/table/data/RealizationsTableData'
import RealizationsTableHeaderLeft from '@/components/kb/panels/realizations/table/header/RealizationsTableHeaderLeft'
import RealizationsTableHeaderMiddle from '@/components/kb/panels/realizations/table/header/RealizationsTableHeaderMiddle'
import RealizationsTableHeaderRight from '@/components/kb/panels/realizations/table/header/RealizationsTableHeaderRight'

import usePanelFactory from '@/components/common/panel/usePanelFactory'
import RealizationsProvider from '@/contexts/panels/realizations/RealizationsProvider'

const RealizationsContent = () => {
  const { createTablePanel } = usePanelFactory()

  return createTablePanel({
    header: {
      headerLeft: <RealizationsHeaderLeft />,
      headerTitle: <RealizationsHeaderTitle />,
      headerRight: <RealizationsHeaderRight />,
    },
    tableHeader: {
      headerLeft: <RealizationsTableHeaderLeft />,
      headerMiddle: <RealizationsTableHeaderMiddle />,
      headerRight: <RealizationsTableHeaderRight />,
    },
    tableData: {
      content: <RealizationsTableData />,
    },
  })
}

const Realizations = () => {
  return (
    <RealizationsProvider>
      <RealizationsContent />
    </RealizationsProvider>
  )
}
export default Realizations
