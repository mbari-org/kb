import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const ConceptSelectAuxiliary = ({ disabled = false, label, components = [] }) => {
  const activeComponents = disabled ? [] : components

  return (
    <Stack
      direction='row'
      alignItems='center'
      sx={{ minHeight: '40px' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
      </Box>
      {activeComponents.length > 0 && (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          {activeComponents.map((component, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {component}
            </Box>
          ))}
        </Box>
      )}
    </Stack>
  )
}

export default ConceptSelectAuxiliary