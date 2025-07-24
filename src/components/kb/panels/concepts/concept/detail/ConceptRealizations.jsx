import { use } from 'react'

import ConceptRealization from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealization'
import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'
import RealizationModifyIcon from '@/components/kb/panels/concepts/concept/change/staged/realizations/RealizationModifyIcon'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const ConceptRealizations = () => {
  const { editing, stagedState } = use(ConceptContext)

  // Create a sorted array with original indices preserved
  const originalRealizations = stagedState?.realizations || []
  const realizationsWithOriginalIndex = originalRealizations.map((realization, originalIndex) => ({
    ...realization,
    originalIndex,
  }))
  const sortedRealizations = realizationsWithOriginalIndex.sort((a, b) => 
    a.linkName.localeCompare(b.linkName)
  )

  const renderItem = (realization, index) => ({
    key: `${realization.linkName}-${realization.toConcept}-${index}`,
    content: `${realization.linkName} | ${realization.toConcept} | ${realization.linkValue}`,
  })

  const renderRealizationComponent = realization => {
    // Use the original index for actions, not the sorted display index
    const realizationWithCorrectIndex = {
      ...realization,
      index: realization.originalIndex,
    }
    return <ConceptRealization realization={realizationWithCorrectIndex} />
  }

  const AddIcon = () => (
    <RealizationModifyIcon
      action={CONCEPT_STATE.REALIZATION.ADD}
      realizationIndex={originalRealizations.length}
    />
  )

  return (
    <ConceptPropertiesSection
      disablePagination={false}
      IconComponent={editing ? AddIcon : undefined}
      items={sortedRealizations}
      renderComponent={renderRealizationComponent}
      renderItem={renderItem}
      title='Realizations'
    />
  )
}

export default ConceptRealizations
