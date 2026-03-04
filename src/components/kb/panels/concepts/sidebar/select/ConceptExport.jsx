import Button from '@mui/material/Button'

import KBTooltip from '@/components/common/KBTooltip'
import useConceptExportModal from '@/components/kb/panels/concepts/concept/detail/export/useConceptExportModal'

import CONFIG from '@/text'

const exportTooltip = CONFIG.PANELS.CONCEPTS.EXPORT.TOOLTIP.EXPORT
const exportButtonLabel = CONFIG.PANELS.CONCEPTS.EXPORT.BUTTON.EXPORT

const ConceptExport = () => {
  const openExportModal = useConceptExportModal()

  return (
    <KBTooltip title={exportTooltip}>
      <Button
        onClick={openExportModal}
        size='small'
        sx={{ ml: 1, mt: 0.25, minWidth: 'auto', px: 1 }}
      >
        {exportButtonLabel}
      </Button>
    </KBTooltip>
  )
}

export default ConceptExport