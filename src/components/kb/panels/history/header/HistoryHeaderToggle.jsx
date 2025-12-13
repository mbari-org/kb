import { use } from 'react'

import { ToggleButtonGroup } from '@mui/material'
import HistoryToggleButton from './HistoryToggleButton'

import HistoryContext from '@/contexts/panels/history/HistoryContext'

import { SELECTED } from '@/lib/constants/selected.js'

const { PENDING, APPROVED, CONCEPT } = SELECTED.SETTINGS.HISTORY.TYPES

const HistoryHeaderToggle = ({ onChange, tooltips }) => {
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
      <HistoryToggleButton value={APPROVED} tooltip={tooltips?.APPROVED} />
      <HistoryToggleButton value={PENDING} tooltip={tooltips?.PENDING} />
      <HistoryToggleButton value={CONCEPT} tooltip={tooltips?.CONCEPT} />
    </ToggleButtonGroup>
  )
}

export default HistoryHeaderToggle
