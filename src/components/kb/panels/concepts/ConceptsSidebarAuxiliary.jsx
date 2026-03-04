import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { LuScrollText } from 'react-icons/lu'

import ConceptSelectNavHistoryAuxiliary from '@/components/common/concept/ConceptSelectNavHistoryAuxiliary'
import KBTooltip from '@/components/common/KBTooltip'

import CONFIG from '@/text'

const exportTooltip = CONFIG.PANELS.CONCEPTS.EXPORT.TOOLTIP.EXPORT
const exportButtonLabel = CONFIG.PANELS.CONCEPTS.EXPORT.BUTTON.EXPORT

const ConceptsSidebarAuxiliary = ({ concepts, onExport, onScrollToConcept }) => {
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

  const rightPrefix = (
    <KBTooltip title='Sroll to Concept'>
      <IconButton
        aria-label='scroll text test'
        color='inherit'
        onClick={onScrollToConcept}
        size='small'
        sx={{ mr: 0.25 }}
      >
        <LuScrollText />
      </IconButton>
    </KBTooltip>
  )

  return <ConceptSelectNavHistoryAuxiliary concepts={concepts} left={left} rightPrefix={rightPrefix} />
}

export default ConceptsSidebarAuxiliary