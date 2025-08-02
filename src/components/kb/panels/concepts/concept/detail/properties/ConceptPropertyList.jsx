import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'

import ConceptSectionTitle from '@/components/common/ConceptSectionTitle'
import ConceptPropertiesEmpty from './ConceptPropertiesEmpty'
import ConceptPropertiesDisclosure from './ConceptPropertiesDisclosure'

const ConceptPropertyList = ({
  IconComponent,
  items = [],
  maxHeight = '300px',
  RenderComponent,
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
      <Box sx={{ minHeight: '56px', height: '56px', mb: 1 }}>
        <ConceptSectionTitle title={title} IconComponent={IconComponent}>
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
        </ConceptSectionTitle>
      </Box>
      <motion.div
        animate={{
          height: expanded ? 'auto' : 0,
        }}
        initial={false}
        style={{
          overflow: 'hidden',
        }}
        transition={{
          type: 'tween',
          duration: 0.3,
          ease: 'easeOut',
        }}
      >
        {hasItems && (
          <Box
            sx={{
              ...(maxHeight && {
                maxHeight,
                overflowY: 'auto',
                pr: 1, // Add padding for scrollbar
              }),
            }}
          >
            <Stack direction='column' spacing={1}>
              {items.map((item, index) => (
                <RenderComponent key={index} item={item} />
              ))}
            </Stack>
          </Box>
        )}
      </motion.div>
    </Box>
  )
}

export default ConceptPropertyList
