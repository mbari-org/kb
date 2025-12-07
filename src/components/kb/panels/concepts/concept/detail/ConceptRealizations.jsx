import { use } from 'react'

import ConceptRealization from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealization'
import ConceptPropertyList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyList'
import RealizationActionIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationActionIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'

const ConceptRealizations = () => {
  const { isEditing, stagedState } = use(ConceptContext)

  const realizations = stagedState?.realizations || []

  const IconComponent = () => (
    <RealizationActionIcon
      action={CONCEPT_STATE.REALIZATION.ADD}
      realizationIndex={realizations.length}
    />
  )
  const RealizationComponent = ({ item }) => <ConceptRealization realization={item} />

  return (
    <ConceptPropertyList
      actionComponent={isEditing ? IconComponent : null}
      renderComponent={RealizationComponent}
      items={realizations}
      title='Realizations'
    />
  )
}

export default ConceptRealizations
