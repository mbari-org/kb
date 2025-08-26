import { use, useState, useMemo, useEffect, useCallback } from 'react'
import { Box, TextField, Divider } from '@mui/material'

import RealizationForm from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/form/RealizationForm'
import RealizationTemplatesFilter from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/filter/RealizationTemplatesFilter'
import ModalActionText from '@/components/common/ModalActionText'
import useAvailableLinkTemplates from './useAvailableLinkTemplates'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'

import { hasDuplicate, EMPTY_REALIZATION } from '@/lib/kb/model/realization'

import useStageRealization from './useStageRealization'
import useRealizationContentHandlers from './useRealizationContentHandlers'
import useFilterLinkName from './useFilterLinkName'

import { actionVerb } from '@/components/kb/panels/concepts/concept/change/action'

import { CONCEPT_STATE, CONCEPT_PROPERTY_LIST } from '@/lib/constants'

const { ITEMS_PER_PAGE } = CONCEPT_PROPERTY_LIST

const EditRealizationContent = () => {
  const { stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { isLoading } = use(PanelDataContext)

  const { action, realizationIndex, modalRealizationItem } = modalData

  const [currentPage, setCurrentPage] = useState(0)
  const [cycleIndex, setCycleIndex] = useState(0)
  const [filterLinkName, setFilterLinkName] = useState('')
  const [isValidToConcept, setIsValidToConcept] = useState(true)
  const [realizationItem, setRealizationItem] = useState(modalRealizationItem || EMPTY_REALIZATION)

  const isEdit = modalData?.action === CONCEPT_STATE.REALIZATION.EDIT
  const actionText = actionVerb(modalData.action)

  // populated form when editing
  useEffect(() => {
    if (isEdit) {
      const editRealization = stagedState?.realizations?.[realizationIndex]
      setRealizationItem(editRealization || modalRealizationItem)
    }
  }, [isEdit, modalRealizationItem, realizationIndex, stagedState?.realizations])

  const getAvailableLinkTemplates = useAvailableLinkTemplates()

  const filteredTemplates = useMemo(() => {
    return getAvailableLinkTemplates(filterLinkName)
  }, [getAvailableLinkTemplates, filterLinkName])

  useEffect(() => {
    setCycleIndex(0)
    setCurrentPage(0)
  }, [filterLinkName])

  // Auto-page to show the currently cycled template (only when cycling, not when manually paging)
  useEffect(() => {
    if (filteredTemplates.length > 0 && cycleIndex > 0) {
      const pageForCurrentTemplate = Math.floor(cycleIndex / ITEMS_PER_PAGE)
      if (pageForCurrentTemplate !== currentPage) {
        setCurrentPage(pageForCurrentTemplate)
      }
    }
  }, [cycleIndex, currentPage, filteredTemplates.length])

  const isDuplicate = useMemo(() => {
    const excludeIndex = action === CONCEPT_STATE.REALIZATION.ADD ? null : realizationIndex
    return hasDuplicate(stagedState.realizations, realizationItem, excludeIndex)
  }, [action, realizationIndex, realizationItem, stagedState.realizations])

  useEffect(() => {
    setModalData(prev => ({
      ...prev,
      isDuplicate,
      isValidToConcept,
    }))
  }, [isDuplicate, isValidToConcept, setModalData])

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

  const { handleFilterKeyDown } = useFilterLinkName({
    cycleIndex,
    filterLinkName,
    filteredTemplates,
    onRealizationChange: handleRealizationChange,
    realizationItem,
    setCycleIndex,
  })

  const handlePageChange = useCallback(newPage => {
    setCurrentPage(newPage)
  }, [])

  const handleValidationChange = useCallback(validationData => {
    if (validationData.isValidToConcept !== undefined) {
      setIsValidToConcept(validationData.isValidToConcept)
    }
  }, [])

  if (!realizationItem) {
    return null
  }

  return (
    <Box>
      {!isEdit && (
        <Box>
          <RealizationTemplatesFilter
            currentPage={currentPage}
            isLoading={isLoading}
            linkName={filterLinkName}
            onPageChange={handlePageChange}
            onTemplateSelect={handleTemplateSelect}
          />
          <TextField
            fullWidth
            label='Filter Link Name'
            onChange={event => {
              const newValue = event.target.value
              setFilterLinkName(newValue)
              handleRealizationChange(EMPTY_REALIZATION)
            }}
            onKeyDown={handleFilterKeyDown}
            size='small'
            sx={{ mb: 2 }}
            value={filterLinkName}
          />
          <Divider sx={{ my: 1 }} />
        </Box>
      )}
      <ModalActionText text={`${actionText} Realization`} />
      <RealizationForm
        isDuplicate={isDuplicate}
        isEditMode={isEdit}
        onRealizationChange={handleRealizationChange}
        onValidationChange={handleValidationChange}
        realizationItem={realizationItem}
        stageChange={stageChange}
      />
    </Box>
  )
}

export default EditRealizationContent
