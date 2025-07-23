import { use } from 'react'
import { Box, Typography } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import StagedGroup from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { formatDelta } from '@/components/common/format'
import { resettingGroup } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { RESETTING } from '@/lib/constants'

const StagedObject = ({ group, stagedEdit }) => {
  const { confirmReset } = use(ConceptContext)

  const [field, { initial, staged }] = stagedEdit

  const groupResetting = resettingGroup(confirmReset, group)

  const disabled = groupResetting === RESETTING.EXTENT.OTHER

  const GroupHeader = () => {
    return (
      <Typography sx={{ fontSize: '1.25rem', opacity: disabled ? 0.5 : 1 }}>{group}</Typography>
    )
  }

  const GroupBody = () => {
    const levelChanged = initial.level !== staged.level
    const nameChanged = initial.name !== staged.name

    const levelValue = formatDelta(initial.level, staged.level)
    const nameValue = formatDelta(initial.name, staged.name)
    return (
      <Box sx={{ ml: 3 }}>
        {nameChanged && <FieldValueDisplay field='name' value={nameValue} />}
        {levelChanged && <FieldValueDisplay field='level' value={levelValue} />}
      </Box>
    )
  }

  return (
    <StagedGroup
      group={field}
      GroupBody={GroupBody}
      GroupHeader={GroupHeader}
      initial={initial}
      resetting={groupResetting}
    />
  )
}

export default StagedObject
