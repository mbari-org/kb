import { Box, Typography } from '@mui/material'
import { use } from 'react'
import SelectedContext from '@/contexts/selected/SelectedContext'

const ConceptReferences = () => {
  const { select } = use(SelectedContext)

  const handleClick = () => {
    select({ panel: 'References', byConcept: true })
  }

  return (
    <Box>
      <Typography
        variant='h6'
        sx={{
          fontWeight: 'bold',
          cursor: 'pointer',
          '&:hover': {
            color: 'primary.main',
          },
        }}
        onClick={handleClick}
      >
        References
      </Typography>
    </Box>
  )
}

export default ConceptReferences
