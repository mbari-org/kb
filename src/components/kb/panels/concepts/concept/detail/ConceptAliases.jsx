import { use } from 'react'

import AliasActionIcon from '@/components/kb/panels/concepts/concept/change/staged/aliases/AliasActionIcon'
import ConceptAlias from '@/components/kb/panels/concepts/concept/detail/aliases/ConceptAlias'
import ConceptPropertyList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyList'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'
import { UI_TEXT } from '@/lib/config/ui-text/index.js'

const ConceptAliases = () => {
  const { isEditing, stagedState } = use(ConceptContext)

  const aliases = stagedState?.aliases || []

  const IconComponent = () => <AliasActionIcon action={CONCEPT_STATE.ALIAS.ADD} aliasIndex={aliases.length} />
  const AliasComponent = ({ item }) => <ConceptAlias alias={item} />

  return (
    <ConceptPropertyList
      actionComponent={isEditing ? IconComponent : null}
      items={aliases}
      renderComponent={AliasComponent}
      title={UI_TEXT.PANELS.CONCEPTS.ALIASES.LABEL}
    />
  )
}

export default ConceptAliases
