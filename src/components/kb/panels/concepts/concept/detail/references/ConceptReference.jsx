import { Box } from '@mui/material'

const ConceptReference = ({ reference }) => {
  if (!reference) {
    return null
  }

  return <Box sx={{ pl: 1 }}>{reference.doi}</Box>
}

export default ConceptReference
