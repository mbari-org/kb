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
    return (
      <Box sx={{ ml: 3 }}>
        {Object.keys(initial).map(field => {
          const hasChanged = initial[field] !== staged[field]
          if (!hasChanged) return null
          
          const deltaValue = formatDelta(initial[field], staged[field])
          return (
            <FieldValueDisplay key={field} field={field} value={deltaValue} />
          )
        })}
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
