import Button from '@mui/material/Button'

import ConceptSelectNavHistoryAuxiliary from '@/components/common/concept/ConceptSelectNavHistoryAuxiliary'
import KBTooltip from '@/components/common/KBTooltip'

import CONFIG from '@/text'

const exportTooltip = CONFIG.PANELS.CONCEPTS.EXPORT.TOOLTIP.EXPORT
const exportButtonLabel = CONFIG.PANELS.CONCEPTS.EXPORT.BUTTON.EXPORT

const ConceptsSidebarAuxiliary = ({ concepts, onExport }) => {
  const left = (
    <KBTooltip title={exportTooltip}>
      <Button
        onClick={onExport}
        size='small'
        sx={{ ml: 1, mt: 0.25, minWidth: 'auto', px: 1 }}
      >
        {exportButtonLabel}
      </Button>
    </KBTooltip>
  )

  return <ConceptSelectNavHistoryAuxiliary concepts={concepts} left={left} />
}

export default ConceptsSidebarAuxiliary