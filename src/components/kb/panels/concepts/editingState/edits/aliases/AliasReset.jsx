import { use } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept_state'
import EditReset from '../EditReset'

const AliasReset = ({ aliasIndex }) => {
  const { editingState, modifyConcept } = use(ConceptContext)

  const onClick = () => {
    // CxTBD Check if this is the only alias edit, and if so, do ALIAS.RESET_ALL
    const count = editingState.aliases.filter(
      item => item.action !== CONCEPT_STATE.NO_ACTION
    ).length
    count === 1
      ? modifyConcept({ type: CONCEPT_STATE.ALIAS.RESET_ALL })
      : modifyConcept({
          type: CONCEPT_STATE.RESET.ALIAS_ITEM,
          update: { aliasIndex },
        })
  }

  return <EditReset onClick={onClick} />
}

export default AliasReset
