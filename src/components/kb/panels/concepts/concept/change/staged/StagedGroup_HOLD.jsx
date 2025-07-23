import { use } from 'react'
import { Box, Typography } from '@mui/material'

import StagedGroup from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup'

import StagedGroupReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedGroupReset'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { RESETTING } from '@/lib/constants'

import {
  resettingGroup,
  resettingItem,
} from '@/components/kb/panels/concepts/concept/change/staged/reset'

const resetting = (confirmReset, group, items) => {
  let itemsResetting = items.staged.map((_stagedItem, index) =>
    resettingItem(confirmReset, group, index)
  )
  const groupResetting = itemsResetting.some(resetting => resetting === RESETTING.EXTENT.ME)
    ? RESETTING.EXTENT.OTHER
    : resettingGroup(confirmReset, group)

  if (groupResetting === RESETTING.EXTENT.ME) {
    itemsResetting = itemsResetting.map(() => RESETTING.EXTENT.ME)
  }

  return { groupResetting, itemsResetting }
}

const StagedGroup_HOLD = ({ group, stagedEdit, StagedGroupItem, stagedItems }) => {
  const { confirmReset } = use(ConceptContext)

  const [_field, items] = stagedEdit

  const { groupResetting, itemsResetting } = resetting(confirmReset, group, items)

  const disabled = groupResetting === RESETTING.EXTENT.OTHER

  return (
    <StagedGroup>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StagedGroupReset group={group} initial={items.initial} resetting={groupResetting} />
        <Typography sx={{ fontSize: '1.25rem', opacity: disabled ? 0.5 : 1 }}>{group}</Typography>
      </Box>
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
    </StagedGroup>
  )
}

export default StagedGroup_HOLD
