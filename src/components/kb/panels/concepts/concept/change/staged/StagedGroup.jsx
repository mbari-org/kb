import { use } from 'react'
import { Box, Typography } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import { formatDelta } from '@/components/common/format'
import StagedGroupReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedGroupReset'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { RESETTING } from '@/lib/constants'

import {
  resettingGroup,
  resettingItem,
} from '@/components/kb/panels/concepts/concept/change/staged/reset'

const StagedGroup = ({ fieldItem = false, group, stagedEdit, StagedGroupItem, stagedItems }) => {
  const { confirmReset } = use(ConceptContext)

  const [field, items] = stagedEdit

  let itemsResetting = items.staged.map((_stagedItem, index) =>
    resettingItem(confirmReset, group, index)
  )
  const groupResetting = itemsResetting.some(resetting => resetting === RESETTING.EXTENT.ME)
    ? RESETTING.EXTENT.OTHER
    : resettingGroup(confirmReset, group)

  if (groupResetting === RESETTING.EXTENT.ME) {
    itemsResetting = itemsResetting.map(() => RESETTING.EXTENT.ME)
  }

  const disabled = groupResetting === RESETTING.EXTENT.OTHER

  const fieldValueDisplay = () => {
    const { initial, staged } = items
    const value = formatDelta(initial, staged)
    return <FieldValueDisplay disabled={disabled} field={field} value={value} />
  }

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StagedGroupReset group={group} initial={items.initial} resetting={groupResetting} />
        {!fieldItem && (
          <Typography sx={{ fontSize: '1.25rem', opacity: disabled ? 0.5 : 1 }}>{group}</Typography>
        )}
        {fieldItem && fieldValueDisplay()}
      </Box>
      {!fieldItem && (
        <Box sx={{ ml: 3 }}>
          {stagedItems.map((stagedItem, index) => {
            return (
              <StagedGroupItem
                key={`${group}-item-${index}`}
                initialItem={items.initial?.[index]}
                resetting={itemsResetting[index]}
                stagedItem={stagedItem}
              />
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default StagedGroup
