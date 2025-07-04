import { use, useEffect, useState } from 'react'
import { MdOutlinePlaylistAdd } from 'react-icons/md'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/common/ConceptPropertiesSection'

import ConfigContext from '@/contexts/config/ConfigContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { getConceptLinkRealizations } from '@/lib/api/linkRealizations'

import { SELECTED } from '@/lib/constants'

const ConceptRealizations = () => {
  const { apiFns } = use(ConfigContext)
  const { getSelected } = use(SelectedContext)

  const [realizations, setRealizations] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const selectedConcept = getSelected(SELECTED.CONCEPT)

  const renderItem = {
    key: (realization, index) => `${realization.linkName}-${realization.toConcept}-${index}`,
    content: realization =>
      `${realization.linkName} | ${realization.toConcept} | ${realization.linkValue}`,
  }

  const handleAddClick = () => {
    console.log('Add realization clicked for concept:', selectedConcept)
  }

  const AddIcon = () => <MdOutlinePlaylistAdd size={24} />

  useEffect(() => {
    const loadRealizations = async () => {
      if (!selectedConcept || !apiFns) {
        setRealizations([])
        return
      }

      setIsLoading(true)
      try {
        const data = await apiFns.apiPayload(getConceptLinkRealizations, selectedConcept)
        setRealizations(data || [])
      } catch (error) {
        console.error('Error loading realizations:', error)
        setRealizations([])
      } finally {
        setIsLoading(false)
      }
    }

    loadRealizations()
  }, [selectedConcept, apiFns])

  return (
    <ConceptPropertiesSection
      isLoading={isLoading}
      items={realizations}
      loadingText='Loading realizations...'
      onInspect={handleAddClick}
      onInspectTooltip='Add new realization for this concept'
      renderItem={renderItem}
      title='Realizations'
      IconComponent={AddIcon}
    />
  )
}

export default ConceptRealizations
