import { use } from 'react'

import ConceptRealization from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealization'
import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'
import RealizationAdd from '@/components/kb/panels/concepts/concept/change/staged/concept/realizations/edit/RealizationAdd'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

const ConceptRealizations = () => {
  const { editing, stagedState } = use(ConceptContext)

  const realizations = stagedState?.realizations || []

  const renderItem = (realization, index) => ({
    key: `${realization.linkName}-${realization.toConcept}-${index}`,
    content: `${realization.linkName} | ${realization.toConcept} | ${realization.linkValue}`,
  })

  const renderRealizationComponent = (realization, _index) => (
    <ConceptRealization realization={realization} />
  )

  const AddIcon = () => <RealizationAdd />

  return (
    <ConceptPropertiesSection
      items={realizations}
      disablePagination={true}
      renderItem={renderItem}
      renderComponent={renderRealizationComponent}
      title='Realizations'
      IconComponent={editing ? AddIcon : undefined}
    />
  )
}

export default ConceptRealizations
