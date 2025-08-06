import { use } from 'react'

import ConceptRealization from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealization'
import ConceptPropertyList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyList'
import RealizationModifyIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationModifyIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const ConceptRealizations = () => {
  const { editing, stagedState } = use(ConceptContext)

  const realizations = stagedState?.realizations || []

  const IconComponent = () => (
    <RealizationModifyIcon
      action={CONCEPT_STATE.REALIZATION.ADD}
      realizationIndex={realizations.length}
    />
  )
  const RealizationComponent = ({ item }) => <ConceptRealization realization={item} />

  return (
    <ConceptPropertyList
      iconComponent={editing ? IconComponent : null}
      renderComponent={RealizationComponent}
      items={realizations}
      title='Realizations'
    />
  )
}

export default ConceptRealizations
