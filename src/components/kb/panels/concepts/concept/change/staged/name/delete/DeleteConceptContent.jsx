import { use, useCallback, useMemo, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import ProcessingMsg from '@/components/common/ProcessingMessage'
import RelatedDataCounts from '@/components/common/concept/RelatedDataCounts'

import ToConceptChoice from '@/components/kb/panels/concepts/concept/change/staged/hierarchy/ToConceptChoice'
import { validateConceptInput } from '@/components/modal/concept/conceptModalUtils'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import { isStateModified } from '@/lib/concept/state/state'

import CONFIG from '@/lib/config'

const { MODALS } = CONFIG.PANELS.CONCEPTS

const DeleteConceptContent = () => {
  const { concept, initialState } = use(ConceptContext)
  const { stagedState } = use(ConceptStagedContext)
  const { setModalData } = use(ConceptModalContext)
  const { modalData } = use(ConceptModalDataContext)
  const { getNames } = use(TaxonomyContext)
  const { isAdmin } = use(UserContext)

  const [isValid, setIsValid] = useState(true)
  const [reassign, setReassignTo] = useState(concept.parent)

  const { relatedDataCounts, isLoading } = modalData
  const hasRelatedData = relatedDataCounts?.some(count => count.value > 0)
  const hasStagedEdits = isStateModified({ initialState, stagedState })

  const omitChoices = useMemo(() => [concept.name, ...concept.alternateNames], [concept])

  const validateInput = useCallback(
    input => validateConceptInput(input, getNames(), omitChoices),
    [getNames, omitChoices]
  )

  const handleChange = (_event, selectedName) => {
    setReassignTo(selectedName)
    const valid = validateInput(selectedName)
    setIsValid(valid)
    setModalData(prev => ({ ...prev, reassign: selectedName, modified: valid, isValid: valid }))
  }

  const handleKeyUp = event => {
    const reassign = event.target.value.trim()
    setReassignTo(reassign)
    const valid = validateInput(reassign)
    setIsValid(valid)
    setModalData(prev => ({ ...prev, reassign: reassign, modified: valid, isValid: valid }))
  }

  return (
    <Box>
      <Typography
        align='center'
        color='cancel'
        sx={{ fontSize: theme => theme.typography.fontSize * 1.5, fontWeight: 'bold' }}
      >
        {MODALS.HIERARCHY.DELETE_CONCEPT.LABEL}
      </Typography>
      {!modalData.isLoading && !hasRelatedData && (
        <Typography align='center'>{MODALS.HIERARCHY.DELETE_CONCEPT.NO_RELATED_DATA}</Typography>
      )}
      {!modalData.isLoading && hasRelatedData && (
        <Typography align='center'>{MODALS.HIERARCHY.DELETE_CONCEPT.MUST_REASSIGN}</Typography>
      )}
      {hasStagedEdits && <Typography align='center'>{MODALS.HIERARCHY.DELETE_CONCEPT.DISCARDS_STAGED}</Typography>}

      {isLoading && <ProcessingMsg message='Loading related data...' />}
      {!modalData.isLoading && hasRelatedData && <RelatedDataCounts relatedDataCounts={relatedDataCounts} />}
      {isAdmin && (
        <Stack direction='column' spacing={1} sx={{ alignItems: 'center' }}>
          <Box>
            {hasRelatedData && (
              <Box sx={{ ml: 1 }}>
                <ToConceptChoice
                  error={!isValid}
                  handleChange={handleChange}
                  handleKeyUp={handleKeyUp}
                  label={MODALS.HIERARCHY.DELETE_CONCEPT.REASSIGN_TO}
                  omitChoices={omitChoices}
                  required
                  value={reassign}
                />
              </Box>
            )}
          </Box>

          {!isValid && (
            <Typography color='cancel' variant='caption'>
              {MODALS.HIERARCHY.DELETE_CONCEPT.ERROR_MESSAGE}
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  )
}

export default DeleteConceptContent
