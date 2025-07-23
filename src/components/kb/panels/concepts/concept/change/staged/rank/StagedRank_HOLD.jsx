import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import StagedGroup_HOLD from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup_HOLD'

import { CONCEPT_RANK, RESETTING } from '@/lib/constants'

import { formatDelta } from '@/components/common/format'

const { GROUP } = RESETTING

const StagedRank = ({ stagedEdit }) => {
  const [_field, { initial, staged }] = stagedEdit

  const fieldValue = field => {
    const initialValue = initial[field]
    const stagedValue = staged[field]

    if (initialValue !== stagedValue) {
      const deltaValue = formatDelta(initialValue, stagedValue)
      return {
        field,
        value: deltaValue,
      }
    }

    return null
  }

  const nameValue = fieldValue(CONCEPT_RANK.NAME)
  const levelValue = fieldValue(CONCEPT_RANK.LEVEL)

  return (
    <StagedGroup_HOLD group={GROUP.RANK} initial={initial}>
      <Box sx={{ ml: 4 }}>
        {nameValue && <FieldValueDisplay {...nameValue} />}
        {levelValue && <FieldValueDisplay {...levelValue} />}
      </Box>
    </StagedGroup_HOLD>
  )
}

export default StagedRank
