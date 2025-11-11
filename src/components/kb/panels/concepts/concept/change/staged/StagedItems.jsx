import { use } from 'react'
import { Box, Typography } from '@mui/material'

import StagedGroup from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { RESETTING } from '@/lib/constants/constants'

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

const StagedItems = ({ group, stagedEdit, StagedGroupItem, stagedItems }) => {
  const { confirmReset } = use(ConceptContext)

  const [_field, items] = stagedEdit

  const { groupResetting, itemsResetting } = resetting(confirmReset, group, items)

  const disabled = groupResetting === RESETTING.EXTENT.OTHER

  const GroupHeader = () => {
    return (
      <Typography sx={{ fontSize: '1.25rem', opacity: disabled ? 0.5 : 1 }}>{group}</Typography>
    )
  }

  const GroupBody = () => {
    return (
      <Box>
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
    )
  }

  return (
    <StagedGroup
      group={group}
      GroupBody={GroupBody}
      GroupHeader={GroupHeader}
      initial={items.initial}
      resetting={groupResetting}
    />
  )
}

export default StagedItems
