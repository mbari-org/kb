import { useState, useEffect } from 'react'
import { Box, Typography, IconButton, Stack } from '@mui/material'
import InspectIcon from '@/components/common/InspectIcon'
import KBTooltip from '@/components/common/KBTooltip'

import ConceptPropertiesList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesList'
import ConceptPropertiesPageButtons from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesPageButtons'

const ITEMS_PER_PAGE = 5

const ConceptPropertiesSection = ({
  children,
  disablePagination = false,
  IconComponent = InspectIcon,
  isLoading = false,
  items = [],
  loadingText = 'Loading...',
  onInspect,
  onInspectTooltip,
  renderComponent = null,
  renderItem,
  title,
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
          {onInspect && IconComponent && (
            <KBTooltip title={onInspectTooltip} placement='top'>
              <IconButton
                onClick={onInspect}
                size='small'
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                  },
                  ml: -1,
                  mt: -1,
                }}
              >
                <IconComponent />
              </IconButton>
            </KBTooltip>
          )}
          {children && <Box sx={{ ml: 2 }}>{children}</Box>}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {hasItems && !disablePagination && (
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
              <ConceptPropertiesPageButtons
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
        <Box sx={{ ml: 1.5, mt: 1 }}>
          {disablePagination && (
            <Stack spacing={1}>
              {items.map((item, index) => (
                <Box key={renderItem.key ? renderItem.key(item, index) : index}>
                  {renderComponent
                    ? renderComponent(item, index)
                    : typeof renderItem.content === 'function'
                    ? renderItem.content(item, index)
                    : renderItem.content}
                </Box>
              ))}
            </Stack>
          )}
          {!disablePagination && (
            <ConceptPropertiesList
              items={items}
              currentPage={currentPage}
              renderItem={renderItem}
            />
          )}
        </Box>
      )}
    </Box>
  )
}

export default ConceptPropertiesSection
