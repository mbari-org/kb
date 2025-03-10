import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import EditReset from '../EditReset'

const AliasReset = ({ aliasIndex }) => {
  const { stagedState, modifyConcept } = use(ConceptContext)

  const onClick = () => {
    // CxTBD Check if this is the only alias edit, and if so, do RESET.ALIASES
    const count = stagedState.aliases.filter(item => item.action !== CONCEPT_STATE.NO_ACTION).length
    count === 1
      ? modifyConcept({ type: CONCEPT_STATE.RESET.ALIASES })
      : modifyConcept({
          type: CONCEPT_STATE.RESET.ALIAS,
          update: { aliasIndex },
        })
  }

  return <EditReset onClick={onClick} />
}

export default AliasReset
