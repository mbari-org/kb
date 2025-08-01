import { use } from 'react'

import ConceptRealization from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealization'
import ConceptPropertyList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyList'
import RealizationModifyIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationModifyIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const ConceptRealizations = () => {
  const { editing, stagedState } = use(ConceptContext)

  const realizations = stagedState?.realizations || []

  const renderRealizationComponent = (realization, _index) => <ConceptRealization realization={realization} />

  const IconComponent = () => (
    <RealizationModifyIcon
      action={CONCEPT_STATE.REALIZATION.ADD}
      realizationIndex={realizations.length}
    />
  )

  return (
    <ConceptPropertyList
      items={realizations}
      renderComponent={renderRealizationComponent}
      title='Realizations'
      IconComponent={editing ? IconComponent : null}
    />
  )
}

export default ConceptRealizations
