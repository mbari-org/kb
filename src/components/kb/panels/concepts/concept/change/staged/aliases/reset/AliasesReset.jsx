import { use } from 'react'

import ResettingButton from '@/components/kb/panels/concepts/concept/change/staged/ResettingButton'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { aliasResetting } from '@/components/kb/panels/concepts/concept/change/staged/reset'

import { CONCEPT_STATE, RESETTING } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const AliasesReset = () => {
  const { confirmReset, modifyConcept } = use(ConceptContext)

  const resetting = aliasResetting(confirmReset) === RESETTING.ME

  const onClick = () => {
    modifyConcept({ type: RESET.ALIASES })
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

export default AliasesReset
