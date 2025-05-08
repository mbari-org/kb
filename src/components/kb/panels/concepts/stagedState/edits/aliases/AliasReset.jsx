import { use } from 'react'

import EditReset from '@/components/kb/panels/concepts/stagedState/edits/EditReset'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const { NO_ACTION, RESET } = CONCEPT_STATE

const AliasReset = ({ index }) => {
  const { stagedState, modifyConcept } = use(ConceptContext)

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

  return <EditReset onClick={onClick} />
}

export default AliasReset
