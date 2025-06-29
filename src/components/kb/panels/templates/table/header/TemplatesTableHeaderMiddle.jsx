import { use } from 'react'

import { Box } from '@mui/material'

import TableHeaderLinkFilter from '@/components/kb/panels/templates/table/header/middle/TableHeaderLinkFilter'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

const TemplatesTableHeaderMiddle = () => {
  const { linkFilter, updateLinkFilter } = use(TemplatesContext)

  if (!linkFilter) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <TableHeaderLinkFilter name='name' value={linkFilter.name} onChange={updateLinkFilter} />
      <TableHeaderLinkFilter name='value' value={linkFilter.value} onChange={updateLinkFilter} />
    </Box>
  )
}

export default TemplatesTableHeaderMiddle
