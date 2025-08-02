import { Box, Typography } from '@mui/material'

const ConceptSectionTitle = ({ title, IconComponent, children, sx = {} }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, ...sx }}>
      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      {IconComponent && (
        <Box
          className='clickable-element'
          sx={{
            alignItems: 'center',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            ml: -0.5,
            mt: -1,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <IconComponent />
        </Box>
      )}
      {children}
    </Box>
  )
}

export default ConceptSectionTitle
