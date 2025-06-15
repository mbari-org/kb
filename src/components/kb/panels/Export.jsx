import { Box } from '@mui/material'

import PanelTitle from '@/components/common/panel/PanelTitle'

const Export = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', ml: 2, gap: 2 }}>
      <PanelTitle title='Export' />
    </Box>
  )
}

export default Export
