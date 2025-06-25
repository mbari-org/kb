import { use, useMemo } from 'react'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/common/ConceptPropertiesSection'

import KBDataContext from '@/contexts/KBDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const ConceptReferences = () => {
  const { references } = use(KBDataContext)
  const { getSelected, select } = use(SelectedContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)

  const conceptReferences = useMemo(() => {
    return references.filter(reference => reference.concepts.includes(selectedConcept))
  }, [references, selectedConcept])

  const renderItem = {
    key: (reference, index) => reference.doi || index,
    content: reference => reference.doi,
  }

  const linkToReferences = () => {
    select({
      references: { [SELECTED.SETTINGS.REFERENCES.BY_CONCEPT]: true },
      [SELECTED.PANEL]: SELECTED.PANELS.REFERENCES,
    })
  }

  return (
    <ConceptPropertiesSection
      items={conceptReferences}
      onInspect={linkToReferences}
      renderItem={renderItem}
      title='References DOI'
    />
  )
}

export default ConceptReferences
