import { use, useState, useMemo, useEffect, useCallback } from 'react'
import { Box, TextField, Divider } from '@mui/material'

import RealizationForm from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/form/RealizationForm'
import RealizationTemplatesList from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/filter/RealizationTemplatesList'
import ModalActionText from '@/components/common/ModalActionText'
import useAvailableLinkTemplates from './useAvailableLinkTemplates'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import { hasDuplicate } from '@/lib/model/realization'
import { EMPTY_TEMPLATE } from '@/lib/model/templates'

import useStageRealization from './useStageRealization'
import useRealizationContentHandlers from './useRealizationContentHandlers'
import useFilterLinkName from './useFilterLinkName'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'
const { REALIZATION } = CONFIG.PANELS.CONCEPTS.MODALS

const EditRealizationContent = () => {
  const { stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { isLoading } = use(PanelDataContext)

  const { action, realizationIndex, modalRealizationItem } = modalData

  const [cycleIndex, setCycleIndex] = useState(0)
  const [filterLinkName, setFilterLinkName] = useState('')
  const [isValidToConcept, setIsValidToConcept] = useState(true)
  const [realizationItem, setRealizationItem] = useState(modalRealizationItem || EMPTY_TEMPLATE)

  const isEdit = modalData?.action === CONCEPT_STATE.REALIZATION.EDIT
  const modalLabel = action === CONCEPT_STATE.REALIZATION.ADD ? REALIZATION.ADD.LABEL : REALIZATION.EDIT.LABEL

  useEffect(() => {
    if (isEdit) {
      const editRealization = stagedState?.realizations?.[realizationIndex]
      const timeoutId = setTimeout(() => {
        setRealizationItem(editRealization || modalRealizationItem)
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [isEdit, modalRealizationItem, realizationIndex, stagedState?.realizations])

  const getAvailableLinkTemplates = useAvailableLinkTemplates()

  const filteredTemplates = useMemo(() => {
    return getAvailableLinkTemplates(filterLinkName)
  }, [getAvailableLinkTemplates, filterLinkName])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCycleIndex(0)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [filterLinkName])

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
          <RealizationTemplatesList
            isLoading={isLoading}
            onTemplateSelect={handleTemplateSelect}
            templates={filteredTemplates}
          />
          <TextField
            fullWidth
            label='Filter by Link Name'
            onChange={event => {
              const newValue = event.target.value
              setFilterLinkName(newValue)
              handleRealizationChange(EMPTY_TEMPLATE)
            }}
            onKeyDown={handleFilterKeyDown}
            size='small'
            sx={{ mb: 2, mt: 2 }}
            value={filterLinkName}
          />
          <Divider sx={{ my: 1 }} />
        </Box>
      )}
      <ModalActionText text={modalLabel} />
      <RealizationForm
        isDuplicate={isDuplicate}
        isEdit={isEdit}
        onRealizationChange={handleRealizationChange}
        onValidationChange={handleValidationChange}
        realizationItem={realizationItem}
        stageChange={stageChange}
      />
    </Box>
  )
}

export default EditRealizationContent
