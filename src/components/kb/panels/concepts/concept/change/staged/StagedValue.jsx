import { use } from 'react'
import { Box, Typography } from '@mui/material'

import StagedItem from '@/components/kb/panels/concepts/concept/change/staged/StagedItem'
import StagedItemReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedItemReset'

import { formatDelta } from '@/components/common/format'
import { resettingGroup } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'

const StagedValue = ({ field, label, stagedEdit }) => {
  const { confirmReset } = use(ConceptStagedContext)

  const [, item] = stagedEdit

  const resetting = resettingGroup(confirmReset, field)

  const normalize = v => (v && typeof v === 'object' && 'value' in v ? v.value : v)
  const deltaValue = formatDelta(normalize(item.initial), normalize(item.staged))

  const itemDetail = () => null

  const itemHeader = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>{label} Edit:</Typography>
      <Typography sx={{ fontWeight: 'bold' }}>{deltaValue}</Typography>
    </Box>
  )

  const itemReset = () => (
    <StagedItemReset group={field} resetting={resetting} stagedItem={item.staged} />
  )

  return (
    <StagedItem
      ItemDetail={itemDetail}
      ItemHeader={itemHeader}
      ItemReset={itemReset}
      resetting={resetting}
    />
  )
}

export default StagedValue
