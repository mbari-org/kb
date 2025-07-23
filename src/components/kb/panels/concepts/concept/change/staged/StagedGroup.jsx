import { use } from 'react'
import { Box, Typography } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import { formatDelta } from '@/components/common/format'
import GroupReset from '@/components/kb/panels/concepts/concept/change/staged/reset/GroupReset'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { RESETTING } from '@/lib/constants'

import { resettingGroup } from '@/components/kb/panels/concepts/concept/change/staged/reset'

const StagedGroup = ({ children, group, initial, stagedEdit }) => {
  const { confirmReset } = use(ConceptContext)

  const resetting = resettingGroup(confirmReset, group)

  const disabled = resetting === RESETTING.EXTENT.OTHER

  const fieldValueDisplay = () => {
    if (!stagedEdit) return null

    const [field, { initial, staged }] = stagedEdit
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
        <GroupReset group={group} initial={initial} resetting={resetting} />
        {!stagedEdit && (
          <Typography sx={{ fontSize: '1.25rem', opacity: disabled ? 0.5 : 1 }}>{group}</Typography>
        )}
        {stagedEdit && fieldValueDisplay()}
      </Box>
      <Box sx={{ ml: 3 }}>{children}</Box>
    </Box>
  )
}

export default StagedGroup
