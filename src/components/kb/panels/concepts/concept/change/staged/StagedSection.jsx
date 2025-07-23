import { Box } from '@mui/material'

const StagedSection = ({ children }) => {
  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      {children}
    </Box>
  )
}

export default StagedSection
