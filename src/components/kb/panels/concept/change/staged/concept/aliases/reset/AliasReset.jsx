import { use } from 'react'

import ResettingButton from '@/components/kb/panels/concept/change/ResettingButton'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { aliasResetting } from '@/components/kb/panels/concept/change/staged/concept/confirmReset'

import { CONCEPT_STATE, RESETTING } from '@/lib/constants'

const { NO_ACTION, RESET } = CONCEPT_STATE

const AliasReset = ({ index }) => {
  const { confirmReset, stagedState, modifyConcept } = use(ConceptContext)

  const resetting = aliasResetting(confirmReset, index) === RESETTING.ME

  const onClick = () => {
    // If last alias, do RESET.ALIASES
    const count = stagedState.aliases.filter(item => item.action !== NO_ACTION).length
    count === 1
      ? modifyConcept({ type: RESET.ALIASES })
      : modifyConcept({
          type: RESET.ALIAS,
          update: { index },
        })
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

export default AliasReset
