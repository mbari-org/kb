import { use, useMemo } from 'react'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/common/ConceptPropertiesSection'

import KBDataContext from '@/contexts/kbData/KBDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const { REFERENCES } = SELECTED.SETTINGS

const ConceptReferences = () => {
  const { references } = use(KBDataContext)
  const { getSelected, updateSelected, updateSettings } = use(SelectedContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)

  const conceptReferences = useMemo(() => {
    return references.filter(reference => reference.concepts.includes(selectedConcept))
  }, [references, selectedConcept])

  const renderItem = {
    key: (reference, index) => reference.doi || index,
    content: reference => reference.doi,
  }

  const linkToReferences = () => {
    updateSelected({ [SELECTED.PANEL]: SELECTED.PANELS.REFERENCES })
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: true } })
  }

  return (
    <ConceptPropertiesSection
      items={conceptReferences}
      onInspect={linkToReferences}
      onInspectTooltip='Link to References for this Concept'
      renderItem={renderItem}
      title='References DOI'
    />
  )
}

export default ConceptReferences
