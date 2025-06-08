import { use } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'

import ConceptSelect from '@/components/common/ConceptSelect'
import PanelTitle from '@/components/common/PanelTitle'
import ToConceptSelect from '@/components/common/ToConceptSelect'

import useAddTemplateModal from './add/useAddTemplateModal'

import TemplatesContext from '@/contexts/templates/TemplatesContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const TemplatesHeader = () => {
  const { getNames } = use(TaxonomyContext)

  const {
    addTemplate,
    count,
    filterConcept,
    filterToConcept,
    handleConceptFilter,
    handleToConceptFilter,
  } = use(TemplatesContext)

  const addTemplateModal = useAddTemplateModal(addTemplate)

  const handleConceptSelect = selector => (_event, conceptName) => selector(conceptName)

  const handleKeyUp = event => {
    if (event.key === 'Enter') {
      const conceptName = event.target.value.trim()
      if (getNames().includes(conceptName)) {
        document.activeElement.blur()
      }
    }
  }

  return (
    <Box>
      <PanelTitle title='Templates' />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.25 }}>
        <Typography sx={{ ml: 2 }}>Total: {count}</Typography>
        <Button variant='contained' color='primary' onClick={addTemplateModal} sx={{ mr: 2 }}>
          Add
        </Button>
      </Box>
      <Stack direction='row' spacing={5} sx={{ ml: 2, mb: 1 }}>
        <ConceptSelect
          conceptName={filterConcept}
          handleConceptSelect={handleConceptSelect(handleConceptFilter)}
          handleKeyUp={handleKeyUp}
          navigation={false}
          sx={{ width: 400 }}
        />
        <ToConceptSelect
          conceptName={filterToConcept}
          handleConceptSelect={handleConceptSelect(handleToConceptFilter)}
          handleKeyUp={handleKeyUp}
          width={400}
        />
      </Stack>
    </Box>
  )
}

export default TemplatesHeader
