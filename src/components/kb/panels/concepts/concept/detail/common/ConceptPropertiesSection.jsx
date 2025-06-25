import { useState, useEffect } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import InspectIcon from '@/components/common/InspectIcon'

import ConceptDetailNone from '@/components/kb/panels/concepts/concept/detail/ConceptDetailNone'
import ConceptPropertiesList from '@/components/kb/panels/concepts/concept/detail/common/ConceptPropertiesList'
import ConceptPropertiesNavButtons from '@/components/kb/panels/concepts/concept/detail/common/ConceptPropertiesNavButtons'

const ITEMS_PER_PAGE = 5

const ConceptPropertiesSection = ({
  title,
  items = [],
  renderItem,
  onInspect,
  isLoading = false,
  loadingText = 'Loading...',
  children, // For additional header content (like the Available switch in Templates)
}) => {
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil((items?.length || 0) / ITEMS_PER_PAGE)
  const hasItems = items?.length > 0

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

  // Reset to page 0 when items change
  useEffect(() => {
    setCurrentPage(0)
  }, [items])

  return (
    <Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <IconButton
            onClick={onInspect}
            size='small'
            sx={{
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <InspectIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {children && <Box sx={{ display: 'flex', alignItems: 'center' }}>{children}</Box>}
          {hasItems && (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                gap: 1,
                justifyContent: 'flex-end',
                minWidth: 175,
              }}
            >
              <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>
                {`${currentPage * ITEMS_PER_PAGE + 1}-${Math.min(
                  (currentPage + 1) * ITEMS_PER_PAGE,
                  items.length
                )} of ${items.length}`}
              </Typography>
              <ConceptPropertiesNavButtons
                currentPage={currentPage}
                onNext={handleNext}
                onPrevious={handlePrevious}
                totalPages={totalPages}
              />
            </Box>
          )}
        </Box>
      </Box>
      {isLoading && (
        <Typography variant='body2' sx={{ color: 'text.secondary', py: 1 }}>
          {loadingText}
        </Typography>
      )}
      {hasItems && !isLoading && (
        <Box sx={{ ml: 1 }}>
          <ConceptPropertiesList items={items} currentPage={currentPage} renderItem={renderItem} />
        </Box>
      )}
      <ConceptDetailNone display={!hasItems && !isLoading} />
    </Box>
  )
}

export default ConceptPropertiesSection
