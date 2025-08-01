import { use } from 'react'

import AliasModifyIcon from '@/components/kb/panels/concepts/concept/change/staged/aliases/AliasModifyIcon'
import ConceptAlias from '@/components/kb/panels/concepts/concept/detail/aliases/ConceptAlias'
import ConceptPropertyList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyList'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const ALIAS = CONCEPT_STATE.ALIAS

const ConceptAliases = () => {
  const { editing, stagedState } = use(ConceptContext)

  const aliases = stagedState?.aliases || []

  const renderAliasComponent = (alias, _index) => <ConceptAlias alias={alias} />

  const IconComponent = () => <AliasModifyIcon action={ALIAS.ADD} aliasIndex={aliases.length} />

  return (
    <ConceptPropertyList
      items={aliases}
      renderComponent={renderAliasComponent}
      title='Alternate Names'
      IconComponent={editing ? IconComponent : null}
    />
  )
}

export default ConceptAliases
