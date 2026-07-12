import PanelDataExport from '@/components/common/panel/PanelDataExport'
import useFilteredReferences from '@/components/kb/panels/references/useFilteredReferences'
import useReferencesExport from '@/components/kb/panels/references/table/header/useReferencesExport'

import { CONCEPT } from '@/lib/constants'
import CONFIG from '@/text'

const ReferencesTableHeaderLeft = () => {
  const { byConcept, filteredReferences } = useFilteredReferences()
  const referencesExport = useReferencesExport()

  const exportTooltip = byConcept
    ? CONFIG.PANELS.REFERENCES.EXPORT.TOOLTIP.EXPORT.CONCEPT
    : CONFIG.PANELS.REFERENCES.EXPORT.TOOLTIP.EXPORT.ALL

  const countLabel = CONFIG.PANELS.REFERENCES.EXPORT.TOTAL
  const exportButtonLabel = CONFIG.PANELS.REFERENCES.EXPORT.BUTTON.EXPORT

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