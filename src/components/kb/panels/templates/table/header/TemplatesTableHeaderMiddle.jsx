import { use } from 'react'

import { Stack, Button } from '@mui/material'

import TableHeaderLinkFilter from '@/components/kb/panels/templates/table/header/middle/TableHeaderLinkFilter'
import KBTooltip from '@/components/common/KBTooltip'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { SELECTED } from '@/lib/kb/constants/selected.js'
import { CONFIG } from '@/config/js/index.js'

const { TEMPLATES } = SELECTED.SETTINGS
const { BUTTON, TOOLTIP } = CONFIG.PANELS.TEMPLATES

const TemplatesTableHeaderMiddle = () => {
  const { filters, updateFilters } = use(TemplatesContext)

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value })
  }

  const handleClearAll = () => {
    updateFilters(null)
  }

  return (
    <Stack
      direction='row'
      alignItems='center'
      spacing={5}
    >
      <TableHeaderLinkFilter
        name={TEMPLATES.FILTERS.LINK_NAME}
        value={filters[TEMPLATES.FILTERS.LINK_NAME] || ''}
        onChange={handleFilterChange}
      />
      <KBTooltip title={TOOLTIP.CLEAR_ALL}>
        <Button
          onClick={handleClearAll}
          sx={{
            fontSize: '0.8rem',
            transform: 'translateY(0.75rem)',
          }}
        >
          {BUTTON.CLEAR_FILTERS}
        </Button>
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
