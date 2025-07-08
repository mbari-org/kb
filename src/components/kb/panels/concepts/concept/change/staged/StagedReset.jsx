import { use } from 'react'

import ResettingButton from '@/components/kb/panels/concepts/concept/change/staged/ResettingButton'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { isStagedAction } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { RESETTING } from '@/lib/constants'

const StagedReset = ({
  child,
  collectionKey,
  field,
  index,
  resetAllType,
  resetChildType,
  resetFieldType,
  resetItemType,
  resettingFunction,
}) => {
  const { confirmReset, stagedState, modifyConcept } = use(ConceptContext)

  const resetting = resettingFunction(confirmReset, index || field || child) === RESETTING.ME

  const onClick = () => {
    if (field !== undefined) {
      // Field-specific reset
      modifyConcept({ type: resetFieldType, update: { field } })
      return
    }

    if (child !== undefined) {
      // Child-specific reset
      stagedState.children.length === 1
        ? modifyConcept({ type: resetAllType })
        : modifyConcept({
            type: resetChildType,
            update: { child },
          })
      return
    }

    if (index !== undefined) {
      // Item-specific reset
      const count = stagedState[collectionKey].filter(item => isStagedAction(item.action)).length
      count === 1
        ? modifyConcept({ type: resetAllType })
        : modifyConcept({
            type: resetItemType,
            update: { index },
          })
      return
    }

    // Collection reset
    modifyConcept({ type: resetAllType })
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
