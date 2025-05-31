import { useState } from 'react'

import { Box } from '@mui/material'

import ReferencesHeader from './ReferencesHeader'
import ReferencesTable from './ReferencesTable'

import useLoadReferences from './useLoadReferences'

const References = () => {
  const { references } = useLoadReferences()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ReferencesHeader references={references} />
      <ReferencesTable references={references} />
    </Box>
  )
}

export default References
