import { use, useState, useEffect, useCallback } from 'react'
import { Box, Typography, IconButton, FormControlLabel, Switch, Tooltip } from '@mui/material'
import InspectIcon from '@/components/common/InspectIcon'

import ConceptDetailNone from '@/components/kb/panels/concepts/concept/detail/ConceptDetailNone'

import ConfigContext from '@/contexts/config/ConfigContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { getAvailableTemplates, getExplicitTemplates } from '@/lib/api/linkTemplates'
import { SELECTED } from '@/lib/constants'

const ITEMS_PER_PAGE = 5

const ConceptTemplates = () => {
  const { apiFns } = use(ConfigContext)
  const { getSelected, select } = use(SelectedContext)

  const [currentPage, setCurrentPage] = useState(0)
  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const available = getSelected(SELECTED.SETTINGS.TEMPLATES.AVAILABLE)

  const loadTemplates = useCallback(async () => {
    if (!apiFns || !selectedConcept) {
      setTemplates([])
      return
    }

    setIsLoading(true)
    try {
      const conceptTemplates = await apiFns.apiPayload(
        available ? getAvailableTemplates : getExplicitTemplates,
        selectedConcept
      )
      setTemplates(conceptTemplates)
    } catch (error) {
      console.error('Error loading concept templates:', error)
      setTemplates([])
    } finally {
      setIsLoading(false)
    }
  }, [apiFns, selectedConcept, available])

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const conceptTemplates = templates
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

  const handleAvailableChange = event => {
    const newValue = event.target.checked
    select({
      [SELECTED.SETTINGS.TEMPLATES.KEY]: { [SELECTED.SETTINGS.TEMPLATES.AVAILABLE]: newValue },
    })
  }

  const linkToTemplates = () => {
    select({
      templates: {
        [SELECTED.SETTINGS.TEMPLATES.CONCEPT]: selectedConcept,
      },
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
        <Box sx={{ flex: 1 }} />
        <Tooltip
          title={
            available
              ? 'Show available templates for this concept (templates that can be used with this concept)'
              : 'Show explicit templates for this concept (templates explicitly defined for this concept)'
          }
          placement='top'
        >
          <FormControlLabel
            control={<Switch checked={available} onChange={handleAvailableChange} size='small' />}
            label='Available'
            sx={{
              fontSize: '0.875rem',
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
              },
            }}
          />
        </Tooltip>
        {hasTemplates && (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              gap: 1,
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
      {isLoading && (
        <Typography variant='body2' sx={{ color: 'text.secondary', py: 1 }}>
          Loading templates...
        </Typography>
      )}
      {hasTemplates && !isLoading && (
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
      <ConceptDetailNone display={!hasTemplates && !isLoading} />
    </Box>
  )
}

export default ConceptTemplates
