import { use } from 'react'

import { Stack, Button } from '@mui/material'

import TableHeaderLinkFilter from '@/components/kb/panels/templates/table/header/middle/TableHeaderLinkFilter'
import KBTooltip from '@/components/common/KBTooltip'

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
    <Stack direction='row' alignItems='center' spacing={5}>
      <TableHeaderLinkFilter
        name={TEMPLATES.FILTERS.LINK_NAME}
        value={filters[TEMPLATES.FILTERS.LINK_NAME] || ''}
        onChange={handleFilterChange}
      />
      <KBTooltip title={TOOLTIP.CLEAR_FILTERS}>
        <span>
          <Button
            disabled={isClearFiltersDisabled}
            onClick={handleClearAll}
            sx={{
              fontSize: '0.8rem',
            }}
          >
            {BUTTON.CLEAR_FILTERS}
          </Button>
        </span>
      </KBTooltip>
      <TableHeaderLinkFilter
        name={TEMPLATES.FILTERS.LINK_VALUE}
        value={filters[TEMPLATES.FILTERS.LINK_VALUE] || ''}
        onChange={handleFilterChange}
      />
    </Stack>
  )
}

export default TemplatesTableHeaderMiddle
