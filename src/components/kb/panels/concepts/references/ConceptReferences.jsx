import { use, useState } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import InspectIcon from '@/components/common/InspectIcon'
import ConceptReferencesList from './ConceptReferencesList'
import ConceptReferencesNavButtons from './ConceptReferencesNavButtons'

import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const ITEMS_PER_PAGE = 5

const ConceptReferences = () => {
  const { references } = use(ReferencesContext)
  const { getSelected, select } = use(SelectedContext)
  const [currentPage, setCurrentPage] = useState(0)

  const selectedConcept = getSelected('concept')
  const conceptReferences = references.filter(reference =>
    reference.concepts.includes(selectedConcept)
  )
  const totalPages = Math.ceil((conceptReferences?.length || 0) / ITEMS_PER_PAGE)

  const hasReferences = conceptReferences?.length > 0

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

  const linkToReferences = () => {
    select({ byConcept: true, panel: 'References' })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          References DOIs
        </Typography>
        <IconButton
          onClick={linkToReferences}
          size='small'
          disabled={!hasReferences}
          sx={{
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <InspectIcon />
        </IconButton>
        {hasReferences && (
          <>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <Typography variant='body2'>
                {`${currentPage * ITEMS_PER_PAGE + 1}-${Math.min(
                  (currentPage + 1) * ITEMS_PER_PAGE,
                  conceptReferences.length
                )} of ${conceptReferences.length}`}
              </Typography>
            </Box>
            <Box>
              <ConceptReferencesNavButtons
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            </Box>
          </>
        )}
      </Box>
      {hasReferences && (
        <Box sx={{ ml: 2 }}>
          <ConceptReferencesList
            references={conceptReferences}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </Box>
      )}
    </Box>
  )
}

export default ConceptReferences
