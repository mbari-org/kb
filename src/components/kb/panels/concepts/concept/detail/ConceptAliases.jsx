import { use } from 'react'

import AliasActionIcon from '@/components/kb/panels/concepts/concept/change/staged/aliases/AliasActionIcon'
import ConceptAlias from '@/components/kb/panels/concepts/concept/detail/aliases/ConceptAlias'
import ConceptPropertyList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyList'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/lib/config'

const AliasComponent = ({ item }) => <ConceptAlias alias={item} />

const ConceptAliases = () => {
  const { isEditing } = use(ConceptContext)
  const { stagedState } = use(ConceptStagedContext)

  const aliases = stagedState?.aliases || []

  const IconComponent = () => <AliasActionIcon action={CONCEPT_STATE.ALIAS.ADD} aliasIndex={aliases.length} />

  return (
    <ConceptPropertyList
      actionComponent={isEditing ? IconComponent : null}
      items={aliases}
      renderComponent={AliasComponent}
      title={CONFIG.PANELS.CONCEPTS.ALIASES.LABEL}
    />
  )
}

export default ConceptAliases
