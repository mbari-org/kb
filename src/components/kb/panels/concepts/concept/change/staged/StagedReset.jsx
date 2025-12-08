import { use } from 'react'

import ResettingButton from '@/components/kb/panels/concepts/concept/change/staged/reset/ResettingButton'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { isStagedAction } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { RESETTING } from '@/lib/constants'

const StagedReset = ({
  child,
  field,
  group,
  index,
  resetChildType,
  resetFieldType,
  resetGroupType,
  resetItemType,
  resettingFunction,
}) => {
  const { confirmReset, modifyConcept, stagedState } = use(ConceptContext)

  const arg = child ?? field ?? index
  const resetting = resettingFunction(confirmReset, arg) === RESETTING.EXTENT.ME

  const onClick = () => {
    if (arg === undefined) {
      modifyConcept({ type: resetGroupType })
      return
    }

    if (arg === child) {
      stagedState.children.length === 1
        ? modifyConcept({ type: resetGroupType })
        : modifyConcept({
            type: resetChildType,
            update: { child },
          })
      return
    }

    if (arg === field) {
      modifyConcept({ type: resetFieldType, update: { field } })
      return
    }

    if (arg === index) {
      const count = stagedState[group].filter(item => isStagedAction(item.action)).length
      count === 1
        ? modifyConcept({ type: resetGroupType })
        : modifyConcept({
            type: resetItemType,
            update: { groupIndex: index },
          })
      return
    }
  }

  return (
    <ResettingButton
      color='cancel'
      disabled={confirmReset}
      onClick={onClick}
      resetting={resetting}
    />
  )
}

export default StagedReset
