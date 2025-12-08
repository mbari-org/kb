import { Box, Typography } from '@mui/material'

const PanelTitle = ({ subtitle, title }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: -2,
        overflow: 'hidden',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <Typography
        component='div'
        align='center'
        sx={{
          fontSize: '2.25rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          component='div'
          align='center'
          sx={{
            fontSize: '1rem',
            mt: 0.5,
            width: '100%',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}

export default PanelTitle
