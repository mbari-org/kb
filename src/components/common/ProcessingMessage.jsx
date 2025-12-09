import { Box } from '@mui/material'

const ProcessingMsg = ({ message }) => {
  return (
    <Box
      className='kb-modal-processing-overlay'
      sx={{
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        bottom: 0,
        color: 'white',
        display: 'flex',
        fontSize: 32,
        fontWeight: 500,
        inset: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 2,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
        <span className='h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent' />
        <span>{message}</span>
      </Box>
    </Box>
  )
}

export default ProcessingMsg
