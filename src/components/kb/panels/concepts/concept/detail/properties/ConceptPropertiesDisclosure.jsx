import { Box } from '@mui/material'
import { IoChevronDown } from 'react-icons/io5'

const ConceptPropertiesDisclosure = ({ expanded, onToggle }) => {
  return (
    <Box
      className='clickable-element'
      onClick={onToggle}
      sx={{
        alignItems: 'center',
        borderRadius: '50%',
        cursor: 'pointer !important',
        display: 'flex',
        height: 32,
        justifyContent: 'center',
        mr: -0.5,
        width: 32,
        '&:hover': {
          backgroundColor: 'action.hover',
          cursor: 'pointer !important',
        },
        '& *': {
          cursor: 'pointer !important', // Ensure child elements also have pointer cursor
        },
      }}
    >
      <IoChevronDown
        size={24}
        style={{
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}
      />
    </Box>
  )
}

export default ConceptPropertiesDisclosure
