import { use } from 'react'

import { Button, Stack } from '@mui/material'

import TableHeaderLinkFilter from '@/components/kb/panels/templates/table/header/middle/TableHeaderLinkFilter'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { EMPTY_FILTERS } from '@/lib/concept/state/templates'
import { SELECTED } from '@/lib/constants/selected.js'
import CONFIG from '@/text'

const { TEMPLATES } = SELECTED.SETTINGS
const { BUTTON, TOOLTIP } = CONFIG.PANELS.TEMPLATES

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
      <TableHeaderLinkFilter
        name={TEMPLATES.FILTERS.LINK_NAME}
        value={filters[TEMPLATES.FILTERS.LINK_NAME] || ''}
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
        name={TEMPLATES.FILTERS.LINK_VALUE}
        value={filters[TEMPLATES.FILTERS.LINK_VALUE] || ''}
        onChange={handleFilterChange}
      />
    </Stack>
  )
}

export default TemplatesTableHeaderMiddle
