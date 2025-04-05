import { Box, Typography } from '@mui/material'

import ChildAdd from './ChildAdd'
import ChildrenReset from './ChildrenReset'

import { fieldSx } from '@/components/common/format'
// import { childEdits } from '@/lib/kb/conceptState/children'

const ChildrenDetail = ({ edit }) => {
  const [_, children] = edit

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ChildrenReset />
        <Typography sx={fieldSx}>Children</Typography>
      </Box>
      <Box sx={{ ml: 3 }}>
        {children.staged.map(child => {
          const { name } = child
          return <ChildAdd key={`add-child-${name}`} child={child} />
        })}
      </Box>
    </Box>
  )
}

export default ChildrenDetail
