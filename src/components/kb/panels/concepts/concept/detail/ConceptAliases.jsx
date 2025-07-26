import { use } from 'react'

import AliasModifyIcon from '@/components/kb/panels/concepts/concept/change/staged/aliases/AliasModifyIcon'
import ConceptAlias from '@/components/kb/panels/concepts/concept/detail/aliases/ConceptAlias'
import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const ALIAS = CONCEPT_STATE.ALIAS

const ConceptAliases = () => {
  const { editing, stagedState } = use(ConceptContext)

  const aliases = stagedState?.aliases || []

  const aliasContent = aliases.map(alias => {
    const { author, name, nameType } = alias
    return [name, author, nameType].map(item => item || '').join('  |  ')
  })

  const renderAliasItem = (alias, index) => ({
    key: alias.name || alias.index || index,
    content: aliasContent,
  })

  const renderAliasComponent = (alias, _index) => <ConceptAlias alias={alias} />

  const IconComponent = () => <AliasModifyIcon action={ALIAS.ADD} aliasIndex={aliases.length} />

  return (
    <ConceptPropertiesSection
      items={aliases}
      disablePagination={true}
      renderItem={renderAliasItem}
      renderComponent={renderAliasComponent}
      title='Alternate Names'
      IconComponent={editing ? IconComponent : null}
    />
  )
}

export default ConceptAliases
