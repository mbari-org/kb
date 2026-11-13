import { use } from 'react'
import { Box, Typography } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import StagedItem from '@/components/kb/panels/concepts/concept/change/staged/StagedItem'
import StagedItemReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedItemReset'

import { formatDelta } from '@/components/common/format'
import { resettingGroup } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'

const StagedObject = ({ field, label, stagedEdit }) => {
  const { confirmReset } = use(ConceptStagedContext)

  const [, { initial, staged }] = stagedEdit

  const resetting = resettingGroup(confirmReset, field)

  const itemDetail = () => (
    <Box>
      {Object.keys(initial)
        .filter(key => key !== 'action')
        .map(key => {
          if (initial[key] !== staged[key]) {
            const deltaValue = formatDelta(initial[key], staged[key])
            return <FieldValueDisplay key={key} field={key} value={deltaValue} />
          }
          return null
        })}
    </Box>
  )

  const itemHeader = () => <Typography>{label} Edit:</Typography>

  const itemReset = () => <StagedItemReset group={field} resetting={resetting} stagedItem={staged} />

  return (
    <StagedItem
      ItemDetail={itemDetail}
      ItemHeader={itemHeader}
      ItemReset={itemReset}
      resetting={resetting}
    />
  )
}

export default StagedObject
