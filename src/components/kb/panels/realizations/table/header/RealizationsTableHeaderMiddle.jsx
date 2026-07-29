import { use } from 'react'

import { Button, Stack } from '@mui/material'

import TableHeaderLinkFilter from '@/components/kb/panels/templates/table/header/middle/TableHeaderLinkFilter'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import { EMPTY_FILTERS } from '@/contexts/panels/realizations/constants'
import { SELECTED } from '@/lib/constants/selected.js'
import CONFIG from '@/lib/config'

const { REALIZATIONS } = SELECTED.SETTINGS
const { BUTTON, TOOLTIP } = CONFIG.PANELS.REALIZATIONS

const RealizationsTableHeaderMiddle = () => {
  const { filters, updateFilters } = use(RealizationsContext)
  const isClearFiltersDisabled = Object.keys(EMPTY_FILTERS).every(key => !filters[key])

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value })
  }

  const handleClearAll = () => {
    updateFilters(null)
  }

  return (
    <Stack direction='row' spacing={5} sx={{ alignItems: 'center' }}>
      <TableHeaderLinkFilter
        name={REALIZATIONS.FILTERS.LINK_NAME}
        value={filters[REALIZATIONS.FILTERS.LINK_NAME] || ''}
        onChange={handleFilterChange}
      />
      <KBTooltipTarget title={TOOLTIP.CLEAR_FILTERS}>
        <Button
          disabled={isClearFiltersDisabled}
          onClick={handleClearAll}
          sx={{
            fontSize: '0.8rem',
          }}
        >
          {BUTTON.CLEAR_FILTERS}
        </Button>
      </KBTooltipTarget>
      <TableHeaderLinkFilter
        name={REALIZATIONS.FILTERS.LINK_VALUE}
        value={filters[REALIZATIONS.FILTERS.LINK_VALUE] || ''}
        onChange={handleFilterChange}
      />
    </Stack>
  )
}

export default RealizationsTableHeaderMiddle
