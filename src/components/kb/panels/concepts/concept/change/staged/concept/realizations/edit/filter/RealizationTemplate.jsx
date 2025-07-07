import { Box, Typography, Link } from '@mui/material'

const RealizationTemplate = ({ template, onTemplateSelect }) => {
  const handleLinkNameClick = () => {
    if (onTemplateSelect) {
      // Create a synthetic event to match the form's handleChange interface
      const syntheticEvent = {
        target: {
          name: 'linkName',
          value: template.linkName,
        },
      }
      onTemplateSelect(syntheticEvent)
    }
  }

  return (
    <Box>
      <Typography variant='body2' fontWeight='bold'>
        <Link
          component='button'
          variant='body2'
          onClick={handleLinkNameClick}
          sx={{
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline',
              color: 'primary.main',
            },
          }}
        >
          {template.linkName}
        </Link>
        {' | '}
        {template.toConcept || 'nil'}
        {' | '}
        {template.linkValue}
      </Typography>
    </Box>
  )
}

export default RealizationTemplate
