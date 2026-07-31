import { use } from 'react'

import { ToggleButtonGroup } from '@mui/material'
import HistoryToggleButton from './HistoryToggleButton'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import CONFIG from '@/lib/config'
import { SELECTED } from '@/lib/constants/selected.js'

const { TOGGLE: TOOGLE_TOOLTIP } = CONFIG.PANELS.HISTORY.PANEL.TOOLTIP
const { PENDING, APPROVED, CONCEPT } = SELECTED.SETTINGS.HISTORY.TYPES

const HistoryHeaderToggle = ({ onChange }) => {
  const { selectedType } = use(HistoryContext)

  return (
    <ToggleButtonGroup
      aria-label='history type'
      exclusive
      onChange={onChange}
      size='small'
      sx={{ mr: 1 }}
      value={selectedType}
    >
      <HistoryToggleButton tooltip={TOOGLE_TOOLTIP.APPROVED} value={APPROVED} />
      <HistoryToggleButton tooltip={TOOGLE_TOOLTIP.PENDING} value={PENDING} />
      <HistoryToggleButton tooltip={TOOGLE_TOOLTIP.CONCEPT} value={CONCEPT} />
    </ToggleButtonGroup>
  )
}

export default HistoryHeaderToggle
