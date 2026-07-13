import RealizationsContent from '@/components/kb/panels/realizations/RealizationsContent'

import RealizationsHeaderLeft from '@/components/kb/panels/realizations/header/RealizationsHeaderLeft'
import RealizationsHeaderTitle from '@/components/kb/panels/realizations/header/RealizationsHeaderTitle'
import RealizationsTableHeaderLeft from '@/components/kb/panels/realizations/table/header/RealizationsTableHeaderLeft'

import usePanelFactory from '@/components/common/panel/usePanelFactory'

const Realizations = () => {
  const { createTablePanel } = usePanelFactory()

  return createTablePanel({
    header: {
      headerLeft: <RealizationsHeaderLeft />,
      headerTitle: <RealizationsHeaderTitle />,
    },
    tableHeader: {
      headerLeft: <RealizationsTableHeaderLeft />,
    },
    tableData: {
      content: <RealizationsContent />,
    },
  })
}

export default Realizations
