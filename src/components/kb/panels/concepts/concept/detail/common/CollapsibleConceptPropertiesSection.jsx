import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import { IoChevronDown } from 'react-icons/io5'

import ConceptPropertiesSection from './ConceptPropertiesSection'
import ConceptPropertiesNavButtons from './ConceptPropertiesNavButtons'
import KBTooltip from '@/components/common/KBTooltip'

const CollapsibleConceptPropertiesSection = ({
  children,
  defaultExpanded = true,
  disablePagination = false,
  IconComponent,
  isLoading = false,
  items = [],
  loadingText = 'Loading...',
  onInspect,
  onInspectTooltip,
  renderComponent = null,
  renderItem,
  title,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [page, setPage] = useState(0)
  const rowsPerPage = 5

  const handleToggle = () => {
    setExpanded(!expanded)
  }

  // Reset page when items change
  useEffect(() => {
    setPage(0)
  }, [items])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const startIndex = page * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {}} // Disable default accordion behavior
      sx={{
        '&:before': {
          display: 'none',
        },
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <AccordionSummary
        onClick={e => e.stopPropagation()} // Prevent default toggle
        sx={{
          minHeight: '48px',
          '& .MuiAccordionSummary-content': {
            margin: '8px 0',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          {onInspect && IconComponent && (
            <KBTooltip title={onInspectTooltip} placement='top'>
              <IconButton
                onClick={e => {
                  e.stopPropagation() // Prevent accordion toggle
                  onInspect()
                }}
                size='small'
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                  },
                  ml: -0.5,
                  mt: -1,
                }}
              >
                <IconComponent />
              </IconButton>
            </KBTooltip>
          )}
          {children && <Box sx={{ ml: 2 }}>{children}</Box>}
        </Box>
        {!disablePagination && items.length > 0 && (
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}
            onClick={e => e.stopPropagation()} // Prevent accordion interference
          >
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
                {`${startIndex + 1}-${Math.min(endIndex, items.length)} of ${items.length}`}
              </Typography>
              <ConceptPropertiesNavButtons
                currentPage={page}
                totalPages={Math.ceil(items.length / rowsPerPage)}
                onPrevious={() => handleChangePage(null, page - 1)}
                onNext={() => handleChangePage(null, page + 1)}
              />
            </Box>
          </Box>
        )}
        {/* Custom expand/collapse button */}
        <IconButton onClick={handleToggle} size='small' sx={{ mr: 1 }}>
          <IoChevronDown
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </IconButton>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0, pb: 1, pl: 2, mt: -2 }}>
        <ConceptPropertiesSection
          disablePagination={true}
          isLoading={isLoading}
          items={paginatedItems}
          loadingText={loadingText}
          renderComponent={renderComponent}
          renderItem={renderItem}
          title=''
        />
      </AccordionDetails>
    </Accordion>
  )
}

export default CollapsibleConceptPropertiesSection
