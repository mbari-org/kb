import ReferencesHeaderLeft from '@/components/kb/panels/references/header/ReferencesHeaderLeft'
import ReferencesHeaderRight from '@/components/kb/panels/references/header/ReferencesHeaderRight'
import ReferencesHeaderTitle from '@/components/kb/panels/references/header/ReferencesHeaderTitle'
import ReferencesTableHeaderLeft from '@/components/kb/panels/references/table/header/ReferencesTableHeaderLeft'
import ReferencesTableHeaderMiddle from '@/components/kb/panels/references/table/header/ReferencesTableHeaderMiddle'
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
      headerTitle: <ReferencesHeaderTitle />,
      headerRight: <ReferencesHeaderRight />,
    },
    tableHeader: {
      headerLeft: <ReferencesTableHeaderLeft />,
      headerMiddle: <ReferencesTableHeaderMiddle />,
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
