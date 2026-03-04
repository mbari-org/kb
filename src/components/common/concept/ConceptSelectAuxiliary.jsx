import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const ConceptSelectAuxiliary = ({ disabled = false, label, left, right }) => {
  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      alignItems='center'
      sx={{ minHeight: '40px' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography
          sx={{
            color: disabled ? 'text.disabled' : 'text.primary',
            fontSize: theme => theme.typography.fontSize * 1.2,
            fontWeight: 'bold',
            ml: 1.5,
          }}
        >
          {label}
        </Typography>
        {left && <Box sx={{ display: 'flex', alignItems: 'center' }}>{left}</Box>}
      </Box>
      {right && !disabled && <Box sx={{ ml: -2, display: 'flex', alignItems: 'center' }}>{right}</Box>}
    </Stack>
  )
}

export default ConceptSelectAuxiliary