import { use } from 'react'

import ConceptRealization from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealization'
import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'
import RealizationModifyIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationModifyIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const ConceptRealizations = () => {
  const { editing, stagedState } = use(ConceptContext)

  const realizations =
    stagedState?.realizations.sort((a, b) => a.linkName.localeCompare(b.linkName)) || []

  const renderItem = (realization, index) => ({
    key: `${realization.linkName}-${realization.toConcept}-${index}`,
    content: `${realization.linkName} | ${realization.toConcept} | ${realization.linkValue}`,
  })

  const renderRealizationComponent = realization => <ConceptRealization realization={realization} />

  const AddIcon = () => (
    <RealizationModifyIcon
      action={CONCEPT_STATE.REALIZATION.ADD}
      realizationIndex={realizations.length}
    />
  )

  return (
    <ConceptPropertiesSection
      disablePagination={false}
      IconComponent={editing ? AddIcon : undefined}
      items={realizations}
      renderComponent={renderRealizationComponent}
      renderItem={renderItem}
      title='Realizations'
    />
  )
}

export default ConceptRealizations
