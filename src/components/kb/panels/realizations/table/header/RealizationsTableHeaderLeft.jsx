import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'
import useRealizationsExport from '@/components/kb/panels/realizations/table/header/useRealizationsExport'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import CONFIG from '@/text'

const RealizationsTableHeaderLeft = () => {
  const { stagedState } = use(ConceptContext)
  const count = stagedState?.realizations?.length || 0
  const realizationsExport = useRealizationsExport()

  return (
    <PanelDataExport
      count={count}
      countLabel={CONFIG.PANELS.REALIZATIONS.EXPORT.TOTAL}
      exportButtonLabel={CONFIG.PANELS.REALIZATIONS.EXPORT.BUTTON.EXPORT}
      exportFn={realizationsExport}
      exportTooltip={CONFIG.PANELS.REALIZATIONS.EXPORT.TOOLTIP.EXPORT.CONCEPT}
      width='auto'
    />
  )
}

export default RealizationsTableHeaderLeft
