import { Box, useTheme } from '@mui/material'

import VersionDisplay from '@/components/common/VersionDisplay'

const StartUpVersion = () => {
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
      <VersionDisplay color={theme.palette.primary.main} variant='caption' />
    </Box>
  )
}

export default StartUpVersion
