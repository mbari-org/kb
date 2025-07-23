import { use } from 'react'

import StagedGroup from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import { formatDelta } from '@/components/common/format'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { RESETTING } from '@/lib/constants'

import { resettingGroup } from '@/components/kb/panels/concepts/concept/change/staged/reset'

const StagedValue = ({ group, stagedEdit }) => {
  const { confirmReset } = use(ConceptContext)

  const [field, item] = stagedEdit

  const groupResetting = resettingGroup(confirmReset, group)

  const disabled = groupResetting === RESETTING.EXTENT.OTHER

  const GroupHeader = () => {
    const { initial, staged } = item
    const value = formatDelta(initial, staged)
    return <FieldValueDisplay disabled={disabled} field={field} value={value} />
  }

  const GroupBody = () => {
    return null
  }

  return (
    <StagedGroup
      group={field}
      GroupBody={GroupBody}
      GroupHeader={GroupHeader}
      initial={item.initial}
      resetting={groupResetting}
    />
  )
}

export default StagedValue
