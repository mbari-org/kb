import { use } from 'react'

import { Box } from '@mui/material'

import ResettingButton from '@/components/kb/panels/concepts/concept/change/staged/reset/ResettingButton'
import { resettingItem } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const ItemReset = ({ group, initialItem, stagedItem }) => {
  const { index } = stagedItem

  const { confirmReset, modifyConcept } = use(ConceptContext)

  const resetting = resettingItem(confirmReset, group, index)

  const onClick = () => {
    modifyConcept({
      type: `${CONCEPT_STATE.RESET.GROUP[group.toUpperCase()]} Item`,
      update: { index },
    })
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ResettingButton color='cancel' onClick={onClick} resetting={resetting} />
    </Box>
  )
}

export default ItemReset
