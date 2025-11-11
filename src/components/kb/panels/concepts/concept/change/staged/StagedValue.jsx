import { use } from 'react'

import StagedGroup from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import { formatDelta } from '@/components/common/format'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { RESETTING } from '@/lib/constants.js'

import { resettingGroup } from '@/components/kb/panels/concepts/concept/change/staged/reset'

const StagedValue = ({ group, stagedEdit }) => {
  const { confirmReset } = use(ConceptContext)

  const [field, item] = stagedEdit

  const groupResetting = resettingGroup(confirmReset, group)

  const disabled = groupResetting === RESETTING.EXTENT.OTHER

  const GroupHeader = () => {
    const { initial, staged } = item

    const normalize = v => (v && typeof v === 'object' && 'value' in v ? v.value : v)
    const initialValue = normalize(initial)
    const stagedValue = normalize(staged)

    const value = formatDelta(initialValue, stagedValue)
    return <FieldValueDisplay disabled={disabled} field={field} value={value} />
  }

  const GroupBody = () => null

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
