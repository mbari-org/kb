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

  const IconComponent = () => <AliasModifyIcon action={ALIAS.ADD} aliasIndex={aliases.length} />
  const AliasComponent = ({ item }) => <ConceptAlias alias={item} />

  return (
    <ConceptPropertyList
      iconComponent={editing ? IconComponent : null}
      items={aliases}
      renderComponent={AliasComponent}
      title='Alternate Names'
    />
  )
}

export default ConceptAliases
