import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import ReferencesHeaderLeft from '@/components/kb/panels/references/header/ReferencesHeaderLeft'
import ReferencesTableHeaderLeft from '@/components/kb/panels/references/table/header/ReferencesTableHeaderLeft'
import ReferencesTableHeaderRight from '@/components/kb/panels/references/table/header/ReferencesTableHeaderRight'
import ReferencesTableData from '@/components/kb/panels/references/table/data/ReferencesTableData'

import usePanelFactory from '@/components/common/panel/usePanelFactory'
import ReferencesProvider from '@/contexts/panels/references/ReferencesProvider'
import { useReferencesModalOperationsContext } from '@/contexts/panels/references/modal'

const ReferencesModalRenderer = () => {
  const { modal: referencesModal, processing: referencesProcessing } = useReferencesModalOperationsContext()
  return (
    !referencesProcessing &&
    referencesModal &&
    typeof referencesModal === 'function' &&
    referencesModal()
  )
}

const ReferencesContent = () => {
  const { createTablePanel } = usePanelFactory()

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

const References = () => {
  return (
    <ReferencesProvider>
      <ReferencesContent />
      <ReferencesModalRenderer />
    </ReferencesProvider>
  )
}

export default References
