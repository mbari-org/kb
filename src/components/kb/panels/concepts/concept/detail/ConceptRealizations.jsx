import { use } from 'react'

import ConceptRealization from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealization'
import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'
import RealizationModifyIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationModifyIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

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

  const AddIcon = () => (
    <RealizationModifyIcon
      action={CONCEPT_STATE.REALIZATION_ITEM.ADD}
      realizationIndex={realizations.length}
    />
  )

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
