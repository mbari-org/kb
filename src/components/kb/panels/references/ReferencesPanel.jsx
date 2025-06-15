import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import ReferencesHeaderLeft from '@/components/kb/panels/references/header/ReferencesHeaderLeft'
import ReferencesTableHeaderLeft from '@/components/kb/panels/references/table/header/ReferencesTableHeaderLeft'
import ReferencesTableHeaderRight from '@/components/kb/panels/references/table/header/ReferencesTableHeaderRight'
import ReferencesTableData from '@/components/kb/panels/references/table/data/ReferencesTableData'

import useTablePanel from '@/components/common/panel/useTablePanel'

const ReferencesPanel = () => {
  const { createTablePanel } = useTablePanel()

  return createTablePanel({
    header: {
      headerLeft: <ReferencesHeaderLeft />,
      headerTitle: <PanelHeaderTitle title='References' />,
    },
    tableHeader: {
      headerLeft: <ReferencesTableHeaderLeft />,
      headerRight: <ReferencesTableHeaderRight />,
    },
    tableData: {
      content: <ReferencesTableData />,
    },
  })
}

export default ReferencesPanel
