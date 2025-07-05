import { use, useEffect, useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { MdOutlinePlaylistAdd } from 'react-icons/md'

import ConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesSection'

import ConfigContext from '@/contexts/config/ConfigContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { getConceptLinkRealizations } from '@/lib/api/linkRealizations'

import { SELECTED } from '@/lib/constants'

const ConceptRealizations = () => {
  const theme = useTheme()
  const { apiFns } = use(ConfigContext)
  const { getSelected } = use(SelectedContext)
  const { editing } = use(ConceptContext)

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

  const AddIcon = () => (
    <Box
      sx={{
        alignItems: 'flex-start',
        backgroundColor: theme.palette.background.paper,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1,
      }}
    >
      <IconButton
        onClick={handleAddClick}
        sx={{
          '&:hover': {
            ...theme.kb.icon.hover,
            color: 'add.main',
          },
          backgroundColor: theme.palette.background.paper,
          padding: 0.5,
        }}
      >
        <MdOutlinePlaylistAdd size={24} />
      </IconButton>
    </Box>
  )

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
      renderItem={renderItem}
      title='Realizations'
      IconComponent={editing ? AddIcon : undefined}
    />
  )
}

export default ConceptRealizations
