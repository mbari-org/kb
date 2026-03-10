import { Box, Stack, Typography } from '@mui/material'

import ConceptSectionTitle from '@/components/common/ConceptSectionTitle'
import RealizationTemplate from './RealizationTemplate'
import CONFIG from '@/text'

const { CONCEPT } = CONFIG
const HEADER_HEIGHT = 42

const RealizationTemplatesList = ({ isLoading = false, maxHeight = 180, onTemplateSelect, templates = [] }) => {
  const hasTemplates = templates.length > 0

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ height: HEADER_HEIGHT }}>
        <ConceptSectionTitle title='Available Templates' sx={{ height: '100%' }}>
          <Box sx={{ ml: 2, flex: 1 }} />
          {hasTemplates && (
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                {templates.length}
              </Typography>
            </Box>
          )}
          {!hasTemplates && (
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' color='text.secondary' sx={{ fontStyle: 'italic' }}>
                {CONCEPT.NO_ITEMS}
              </Typography>
            </Box>
          )}
        </ConceptSectionTitle>
      </Box>
      <Box sx={{ height: maxHeight, mt: 1, overflowY: 'auto', pr: 1 }}>
        {isLoading && (
          <Typography variant='body2' sx={{ color: 'text.secondary', py: 1 }}>
            Loading templates...
          </Typography>
        )}
        {!isLoading && hasTemplates && (
          <Stack direction='column' spacing={1}>
            {templates.map((template, index) => (
              <RealizationTemplate
                key={`${template.concept}-${template.linkName}-${index}`}
                template={template}
                onTemplateSelect={onTemplateSelect}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default RealizationTemplatesList
