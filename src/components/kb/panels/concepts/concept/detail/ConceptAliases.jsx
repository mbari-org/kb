import { use } from 'react'

import AliasAdd from '@/components/kb/panels/concepts/concept/change/staged/concept/aliases/edit/AliasAdd'
import ConceptAlias from '@/components/kb/panels/concepts/concept/detail/aliases/ConceptAlias'
import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const ConceptAliases = () => {
  const { editing, stagedState } = use(ConceptContext)

  const aliases = stagedState?.aliases || []

  const renderAliasItem = (alias, index) => ({
    key: alias.name || alias.index || index,
    content: `${alias.name || ''} | ${alias.author || ''} | ${alias.nameType || ''}`,
  })

  const renderAliasComponent = (alias, _index) => <ConceptAlias alias={alias} />

  const AddIcon = () => <AliasAdd aliasIndex={aliases.length} />

  return (
    <ConceptPropertiesSection
      items={aliases}
      disablePagination={true}
      renderItem={renderAliasItem}
      renderComponent={renderAliasComponent}
      title='Alternate Names'
      IconComponent={editing ? AddIcon : undefined}
    />
  )
}

export default ConceptAliases
