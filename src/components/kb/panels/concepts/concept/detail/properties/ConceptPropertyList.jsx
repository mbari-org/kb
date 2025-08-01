import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'

import ConceptPropertiesEmpty from './ConceptPropertiesEmpty'
import ConceptPropertiesDisclosure from './ConceptPropertiesDisclosure'

const ConceptPropertyList = ({
  IconComponent,
  items = [],
  renderComponent,
  title,
}) => {
  const [expanded, setExpanded] = useState(true)

  const hasItems = items?.length > 0

  const handleToggle = () => {
    if (hasItems) {
      setExpanded(!expanded)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minHeight: '56px', height: '56px', mb: 1 }}>
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
        <Box sx={{ ml: 2, flex: 1 }} />
        {hasItems && (
          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant='body2' color='text.secondary'>
              {items.length}
            </Typography>
          </Box>
        )}
        {!hasItems && (
          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            <ConceptPropertiesEmpty />
          </Box>
        )}
        {hasItems && (
          <ConceptPropertiesDisclosure expanded={expanded} onToggle={handleToggle} />
        )}
      </Box>
      {hasItems && expanded && (
        <Stack direction='column' spacing={1}>
          {items.map((item, index) => renderComponent(item, index))}
        </Stack>
      )}
    </Box>
  )
}

export default ConceptPropertyList
