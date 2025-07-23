import { use } from 'react'

import { Box } from '@mui/material'

import ResettingButton from '@/components/kb/panels/concepts/concept/change/staged/reset/ResettingButton'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const StagedItemReset = ({ group, resetting, stagedItem }) => {
  const { index } = stagedItem

  const { modifyConcept } = use(ConceptContext)

  const onClick = () => {
    modifyConcept({
      type: CONCEPT_STATE.RESET.GROUP[group.toUpperCase()],
      update: { index },
    })
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ResettingButton color='cancel' onClick={onClick} resetting={resetting} />
    </Box>
  )
}

export default StagedItemReset
