import PanelDataExport from '@/components/common/panel/PanelDataExport'
import useFilteredReferences from '@/components/kb/panels/references/useFilteredReferences'
import useReferencesExport from '@/components/kb/panels/references/table/header/useReferencesExport'

import { CONCEPT } from '@/lib/constants'
import CONFIG from '@/lib/config'

const { BUTTON } = CONFIG
const { TOOLTIP, TOTAL } = CONFIG.PANELS.REFERENCES.EXPORT

const ReferencesTableHeaderLeft = () => {
  const { byConcept, filteredReferences } = useFilteredReferences()
  const referencesExport = useReferencesExport()

  const exportTooltip = byConcept ? TOOLTIP.EXPORT.CONCEPT : TOOLTIP.EXPORT.ALL

  const countLabel = TOTAL
  const exportButtonLabel = BUTTON.EXPORT

  return (
    <PanelDataExport
      count={filteredReferences.length}
      countLabel={countLabel}
      exportButtonLabel={exportButtonLabel}
      exportFn={referencesExport}
      exportTooltip={exportTooltip}
      width={CONCEPT.SELECT.WIDTH}
    />
  )
}

export default ReferencesTableHeaderLeft
