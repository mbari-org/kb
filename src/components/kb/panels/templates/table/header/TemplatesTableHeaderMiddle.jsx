import { use } from 'react'

import { Box } from '@mui/material'

import TableHeaderLinkFilter from '@/components/kb/panels/templates/table/header/middle/TableHeaderLinkFilter'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesTableHeaderMiddle = () => {
  const { filters, updateFilters } = use(TemplatesContext)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <TableHeaderLinkFilter
        name={TEMPLATES.FILTERS.LINK_NAME}
        value={filters[TEMPLATES.FILTERS.LINK_NAME] || ''}
        onChange={(key, value) => updateFilters({ [key]: value })}
      />
      <TableHeaderLinkFilter
        name={TEMPLATES.FILTERS.LINK_VALUE}
        value={filters[TEMPLATES.FILTERS.LINK_VALUE] || ''}
        onChange={(key, value) => updateFilters({ [key]: value })}
      />
    </Box>
  )
}

export default TemplatesTableHeaderMiddle
