import { use, useState } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import InspectIcon from '@/components/common/InspectIcon'

import ConceptDetailNone from '@/components/kb/panels/concepts/concept/detail/ConceptDetailNone'

import KBDataContext from '@/contexts/KBDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const ITEMS_PER_PAGE = 5

const ConceptTemplates = () => {
  const { templates } = use(KBDataContext)
  const { getSelected, select } = use(SelectedContext)

  const [currentPage, setCurrentPage] = useState(0)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const conceptTemplates = templates.filter(template => template.concept === selectedConcept)
  const totalPages = Math.ceil((conceptTemplates?.length || 0) / ITEMS_PER_PAGE)

  const hasTemplates = conceptTemplates?.length > 0

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const linkToTemplates = () => {
    select({
      templates: { [SELECTED.SETTINGS.TEMPLATES.AVAILABLE]: false },
      [SELECTED.PANEL]: SELECTED.PANELS.TEMPLATES,
    })
  }

  const startIndex = currentPage * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTemplates = conceptTemplates?.slice(startIndex, endIndex) || []

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Templates
        </Typography>
        <IconButton
          onClick={linkToTemplates}
          size='small'
          sx={{
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <InspectIcon />
        </IconButton>
        {hasTemplates && (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              gap: 1,
              justifyContent: 'flex-end',
            }}
          >
            <Typography>
              {`${currentPage * ITEMS_PER_PAGE + 1}-${Math.min(
                (currentPage + 1) * ITEMS_PER_PAGE,
                conceptTemplates.length
              )} of ${conceptTemplates.length}`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton onClick={handlePrevious} disabled={currentPage === 0} size='small'>
                ‹
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1}
                size='small'
              >
                ›
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
      {hasTemplates && (
        <Box sx={{ ml: 1 }}>
          {currentTemplates.map((template, index) => (
            <Typography
              key={`${template.concept}-${template.linkName}-${index}`}
              variant='body1'
              sx={{
                pl: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              {template.linkName}: {template.toConcept} → {template.linkValue}
            </Typography>
          ))}
        </Box>
      )}
      <ConceptDetailNone display={!hasTemplates} />
    </Box>
  )
}

export default ConceptTemplates
