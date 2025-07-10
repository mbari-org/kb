import { use, useState, useMemo } from 'react'
import { Box, Divider } from '@mui/material'

import RealizationForm from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/RealizationForm'
import RealizationTemplatesFilter from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/filter/RealizationTemplatesFilter'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { EMPTY_REALIZATION } from '@/lib/kb/model/realization'

import useStageRealization from './useStageRealization'

import useDebounce from '@/hooks/useDebounce'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { CONCEPT_STATE } from '@/lib/constants'

const RealizationContent = () => {
  const { stagedState, concept } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { isLoading, templates } = use(PanelDataContext)
  const { getAncestors } = use(TaxonomyContext)

  const { action, realizationIndex, modalRealizationItem } = modalData

  const [realizationItem, setRealizationItem] = useState(modalRealizationItem)

  const conceptNames = useMemo(() => {
    return concept ? [concept.name, ...getAncestors(concept.name)] : []
  }, [concept, getAncestors])

  const availableLinkTemplates = linkName =>
    filterTemplates(templates, {
      concepts: conceptNames,
      linkName: linkName,
    })

  const debouncedInput = useDebounce((updatedRealizationItem, fieldIsModified, field) => {
    const updatedModified = { ...modalData.modified, [field]: fieldIsModified }

    setModalData(prev => ({
      ...prev,
      realizationItem: updatedRealizationItem,
      modified: updatedModified,
    }))
  }, 300)

  const handleRealizationChange = (updatedRealizationItem, field) => {
    setRealizationItem(updatedRealizationItem)

    const fieldIsModified =
      action === CONCEPT_STATE.REALIZATION_ITEM.ADD
        ? updatedRealizationItem[field] !== EMPTY_REALIZATION[field]
        : stagedState.realizations[realizationIndex][field] !== updatedRealizationItem[field]

    debouncedInput(updatedRealizationItem, fieldIsModified, field)
  }

  const handleToConceptSelect = newValue => {
    const updatedRealizationItem = {
      ...realizationItem,
      toConcept: newValue,
    }

    setRealizationItem(updatedRealizationItem)

    const fieldIsModified =
      action === CONCEPT_STATE.REALIZATION_ITEM.ADD
        ? updatedRealizationItem.toConcept !== EMPTY_REALIZATION.toConcept
        : stagedState.realizations[realizationIndex].toConcept !== updatedRealizationItem.toConcept

    debouncedInput(updatedRealizationItem, fieldIsModified, 'toConcept')
  }

  const handleToConceptSpecial = value => {
    // When a special value is selected, use it as the toConcept value
    const updatedRealizationItem = {
      ...realizationItem,
      toConcept: value === null ? '' : value,
    }

    setRealizationItem(updatedRealizationItem)

    const fieldIsModified =
      action === CONCEPT_STATE.REALIZATION_ITEM.ADD
        ? updatedRealizationItem.toConcept !== EMPTY_REALIZATION.toConcept
        : stagedState.realizations[realizationIndex].toConcept !== updatedRealizationItem.toConcept

    debouncedInput(updatedRealizationItem, fieldIsModified, 'toConcept')
  }

  const stageRealization = useStageRealization()
  const stageChange = event => {
    stageRealization(event)
  }

  if (!realizationItem) {
    return null
  }

  return (
    <Box>
      <RealizationTemplatesFilter
        availableLinkTemplates={availableLinkTemplates}
        isLoading={isLoading}
        linkName={realizationItem.linkName}
        onTemplateSelect={handleRealizationChange}
      />
      <Divider sx={{ my: 1 }} />
      <RealizationForm
        availableLinkTemplates={availableLinkTemplates}
        realizationItem={realizationItem}
        onRealizationChange={handleRealizationChange}
        handleToConceptSelect={handleToConceptSelect}
        handleToConceptSpecial={handleToConceptSpecial}
        stageChange={stageChange}
      />
    </Box>
  )
}

export default RealizationContent
