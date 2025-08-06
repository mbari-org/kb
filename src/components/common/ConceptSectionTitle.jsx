import { Box, Typography } from '@mui/material'

const ConceptSectionTitle = ({ children, color, iconComponent, sx = {}, title }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, ...sx }}>
      <Typography variant='h6' sx={{ color, fontWeight: 'bold' }}>
        {title}
      </Typography>
      {iconComponent && (
        <Box
          className='clickable-element'
          sx={{
            alignItems: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            ml: -0.5,
            mt: -1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {iconComponent()}
        </Box>
      )}
      {children}
    </Box>
  )
}

export default ConceptSectionTitle
