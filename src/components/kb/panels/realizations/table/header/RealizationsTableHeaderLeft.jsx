import { use } from 'react'

import PanelDataExport from '@/components/common/panel/PanelDataExport'
import useRealizationsExport from '@/components/kb/panels/realizations/table/header/useRealizationsExport'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import { SELECTED } from '@/lib/constants/selected.js'
import CONFIG from '@/lib/config'

const RealizationsTableHeaderLeft = () => {
  const { filteredRealizations, filters } = use(RealizationsContext)
  const { REALIZATIONS } = SELECTED.SETTINGS
  const count = filteredRealizations.length
  const realizationsExport = useRealizationsExport()

  const exportTooltip =
    filters[REALIZATIONS.FILTERS.CONCEPT] || filters[REALIZATIONS.FILTERS.TO_CONCEPT]
      ? CONFIG.PANELS.REALIZATIONS.EXPORT.TOOLTIP.EXPORT.CONCEPT
      : CONFIG.PANELS.REALIZATIONS.EXPORT.TOOLTIP.EXPORT.ALL

  return (
    <PanelDataExport
      count={count}
      countLabel={CONFIG.PANELS.REALIZATIONS.EXPORT.TOTAL}
      exportButtonLabel={CONFIG.PANELS.REALIZATIONS.EXPORT.BUTTON.EXPORT}
      exportFn={realizationsExport}
      exportTooltip={exportTooltip}
      width='auto'
    />
  )
}

export default RealizationsTableHeaderLeft
