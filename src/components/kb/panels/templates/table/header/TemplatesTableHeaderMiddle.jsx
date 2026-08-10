import { use } from 'react'

import { Button, Stack } from '@mui/material'

import TableHeaderLinkFilter from '@/components/kb/panels/templates/table/header/middle/TableHeaderLinkFilter'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import dataFilters from '@/contexts/panels/dataFilters'
import { SELECTED } from '@/lib/constants/selected.js'
import CONFIG from '@/lib/config'

const { BUTTON } = CONFIG
const { TEMPLATES: TEMPLATE_SETTINGS } = SELECTED.SETTINGS
const { EMPTY_FILTERS } = dataFilters(TEMPLATE_SETTINGS.KEY)
const { TOOLTIP } = CONFIG.PANELS.TEMPLATES.PANEL

const TemplatesTableHeaderMiddle = () => {
  const { filters, updateFilters } = use(TemplatesContext)
  const isClearFiltersDisabled = Object.keys(EMPTY_FILTERS).every(key => !filters[key])

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value })
  }

  const handleClearAll = () => {
    updateFilters(null)
  }

  return (
    <Stack direction='row' spacing={5} sx={{ alignItems: 'center' }}>
      <KBTooltipTarget title={TOOLTIP.FILTER.LINK_NAME}>
        <TableHeaderLinkFilter
          name={TEMPLATE_SETTINGS.FILTERS.LINK_NAME}
          value={filters[TEMPLATE_SETTINGS.FILTERS.LINK_NAME] || ''}
          onChange={handleFilterChange}
        />
      </KBTooltipTarget>
      <Button
        disabled={isClearFiltersDisabled}
        onClick={handleClearAll}
        sx={{
          fontSize: '0.8rem',
        }}
      >
        {BUTTON.CLEAR_FILTERS}
      </Button>
      <KBTooltipTarget title={TOOLTIP.FILTER.LINK_VALUE}>
        <TableHeaderLinkFilter
          name={TEMPLATE_SETTINGS.FILTERS.LINK_VALUE}
          value={filters[TEMPLATE_SETTINGS.FILTERS.LINK_VALUE] || ''}
          onChange={handleFilterChange}
        />
      </KBTooltipTarget>
    </Stack>
  )
}

export default TemplatesTableHeaderMiddle
