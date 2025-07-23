import { use } from 'react'
import { Box } from '@mui/material'

import StagedGroup from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import { formatDelta } from '@/components/common/format'
import StagedGroupReset from '@/components/kb/panels/concepts/concept/change/staged/reset/StagedGroupReset'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { RESETTING } from '@/lib/constants'

import { resettingGroup } from '@/components/kb/panels/concepts/concept/change/staged/reset'

const StagedField = ({ stagedEdit }) => {
  const { confirmReset } = use(ConceptContext)

  const [field, items] = stagedEdit

  const groupResetting = resettingGroup(confirmReset, field)

  const disabled = groupResetting === RESETTING.EXTENT.OTHER

  const fieldValueDisplay = () => {
    const { initial, staged } = items
    const value = formatDelta(initial, staged)
    return <FieldValueDisplay disabled={disabled} field={field} value={value} />
  }

  return (
    <StagedGroup>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StagedGroupReset group={field} initial={items.initial} resetting={groupResetting} />
        {fieldValueDisplay()}
      </Box>
    </StagedGroup>
  )
}

export default StagedField
