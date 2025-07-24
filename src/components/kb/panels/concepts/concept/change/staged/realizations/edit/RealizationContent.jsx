import { use, useState, useMemo, useEffect, useCallback } from 'react'
import { Box, Divider, Typography, TextField } from '@mui/material'

import RealizationForm from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/form/RealizationForm'
import RealizationTemplatesFilter from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/filter/RealizationTemplatesFilter'
import useAvailableLinkTemplates from './useAvailableLinkTemplates'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'

import { EMPTY_TEMPLATE } from '@/lib/kb/model/template'
import { checkForDuplicate } from '@/lib/kb/model/realization'

import useStageRealization from './useStageRealization'
import useRealizationContentHandlers from './useRealizationContentHandlers'

import { CONCEPT_STATE, CONCEPT_PROPERTY_LIST } from '@/lib/constants'

const { ITEMS_PER_PAGE } = CONCEPT_PROPERTY_LIST

const RealizationContent = () => {
  const { stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { isLoading } = use(PanelDataContext)

  const { action, realizationIndex, modalRealizationItem } = modalData
  const isEditMode = modalData?.action === 'Realization Edit'

  const [realizationItem, setRealizationItem] = useState(modalRealizationItem || EMPTY_TEMPLATE)
  
  // Ensure form is populated with realization data in edit mode
  useEffect(() => {
    if (isEditMode) {
      // In edit mode, get the realization from stagedState using the index
      const editRealization = stagedState?.realizations?.[realizationIndex]
      
      if (editRealization) {
        setRealizationItem(editRealization)
      } else if (modalRealizationItem) {
        setRealizationItem(modalRealizationItem)
      }
    }
  }, [isEditMode, modalRealizationItem, stagedState?.realizations, realizationIndex])
  const [filterLinkName, setFilterLinkName] = useState('')
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  // Template logic for filter auto-population
  const getAvailableLinkTemplates = useAvailableLinkTemplates()

  // Get all templates that match the current filter (for cycling)
  const filteredTemplates = useMemo(() => {
    return getAvailableLinkTemplates(filterLinkName)
  }, [getAvailableLinkTemplates, filterLinkName])

  // Reset cycle index and page when filter changes
  useEffect(() => {
    setCurrentCycleIndex(0)
    setCurrentPage(0)
  }, [filterLinkName])

  // Auto-page to show the currently cycled template (only when cycling, not when manually paging)
  useEffect(() => {
    if (filteredTemplates.length > 0 && currentCycleIndex > 0) {
      const pageForCurrentTemplate = Math.floor(currentCycleIndex / ITEMS_PER_PAGE)
      if (pageForCurrentTemplate !== currentPage) {
        setCurrentPage(pageForCurrentTemplate)
      }
    }
  }, [currentCycleIndex, filteredTemplates.length, currentPage])

  const isDuplicate = useMemo(() => {
    const excludeIndex = action === CONCEPT_STATE.REALIZATION.ADD ? null : realizationIndex
    return checkForDuplicate(stagedState.realizations, realizationItem, excludeIndex)
  }, [realizationItem, stagedState.realizations, action, realizationIndex])

  const actionText = modalData?.action?.split(' ').pop() || 'Edit'

  useEffect(() => {
    setModalData(prev => ({
      ...prev,
      isDuplicate,
    }))
  }, [isDuplicate, setModalData])

  const stageChange = useStageRealization()

  const { handleRealizationChange, handleTemplateSelect } = useRealizationContentHandlers({
    action,
    modalData,
    realizationIndex,
    realizationItem,
    setModalData,
    setRealizationItem,
    stagedState,
    stageChange,
  })

  const handleFilterKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        const currentInput = filterLinkName.trim()

        if (currentInput && filteredTemplates.length > 0) {
          event.preventDefault()

          // Get the current template to populate the form with
          const templateToUse = filteredTemplates[currentCycleIndex]

          if (templateToUse) {
            // Auto-populate the form with the current cycle template
            const updatedRealizationItem = {
              ...realizationItem,
              linkName: templateToUse.linkName,
              toConcept: templateToUse.toConcept,
              linkValue: templateToUse.linkValue,
              templateId: templateToUse.id,
            }
            handleRealizationChange(updatedRealizationItem, 'linkName')

            // Advance to next template for next Enter press (cycle back to 0 if at end)
            setCurrentCycleIndex(prevIndex => (prevIndex + 1) % filteredTemplates.length)
          }
        }
      }
    },
    [filterLinkName, filteredTemplates, currentCycleIndex, realizationItem, handleRealizationChange]
  )

  // Handle manual page changes (when user clicks pagination buttons)
  const handlePageChange = useCallback(newPage => {
    setCurrentPage(newPage)
  }, [])

  if (!realizationItem) {
    return null
  }

  return (
    <Box>
      {!isEditMode && (
        <>
          <RealizationTemplatesFilter
            isLoading={isLoading}
            linkName={filterLinkName}
            onTemplateSelect={handleTemplateSelect}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
          <TextField
            label='Filter Link Name'
            size='small'
            value={filterLinkName}
            onChange={event => {
              const newValue = event.target.value
              setFilterLinkName(newValue)

              // Clear form immediately when filter changes
              const updatedRealizationItem = {
                ...realizationItem,
                ...EMPTY_TEMPLATE,
                templateId: null,
              }
              handleRealizationChange(updatedRealizationItem, 'linkName')
            }}
            onKeyDown={handleFilterKeyDown}
            sx={{ mb: 2 }}
            fullWidth
          />
          <Divider sx={{ my: 1 }} />
        </>
      )}
      <Typography variant='h6'>{actionText} Realization</Typography>
      <RealizationForm
        onRealizationChange={handleRealizationChange}
        realizationItem={realizationItem}
        stageChange={stageChange}
        isEditMode={isEditMode}
      />
    </Box>
  )
}

export default RealizationContent
