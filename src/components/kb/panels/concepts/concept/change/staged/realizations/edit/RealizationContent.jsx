import { use, useState, useMemo, useEffect } from 'react'
import { Box, Divider, Typography } from '@mui/material'

import RealizationForm from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/form/RealizationForm'
import RealizationTemplatesFilter from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/filter/RealizationTemplatesFilter'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'

import { EMPTY_TEMPLATE } from '@/lib/kb/model/template'
import { checkForDuplicate } from '@/lib/kb/model/realization'

import useStageRealization from './useStageRealization'
import useRealizationContentHandlers from './useRealizationContentHandlers'

import { CONCEPT_STATE } from '@/lib/constants'

const RealizationContent = () => {
  const { stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { isLoading } = use(PanelDataContext)

  const { action, realizationIndex, modalRealizationItem } = modalData

  const [realizationItem, setRealizationItem] = useState(modalRealizationItem || EMPTY_TEMPLATE)

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

  if (!realizationItem) {
    return null
  }

  return (
    <Box>
      <RealizationTemplatesFilter
        isLoading={isLoading}
        linkName={realizationItem.linkName}
        onTemplateSelect={handleTemplateSelect}
      />
      <Typography>Filter Link Name</Typography>
      <Divider sx={{ my: 1 }} />
      <Typography variant='h6'>{actionText} Realization</Typography>
      <RealizationForm
        onRealizationChange={handleRealizationChange}
        realizationItem={realizationItem}
        stageChange={stageChange}
      />
    </Box>
  )
}

export default RealizationContent
