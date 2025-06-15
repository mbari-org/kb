import { use, useMemo } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'

import ConceptSelect from '@/components/common/ConceptSelect'
import PanelTitle from '@/components/common/PanelTitle'
import ToConceptSelect from '@/components/common/ToConceptSelect'

import useAddTemplateModal from './add/useAddTemplateModal'
import useTemplatesExport from './useTemplatesExport'

import TemplatesContext from '@/contexts/templates/TemplatesContext'

const TemplatesHeader = () => {
  const {
    addTemplate,
    count,
    filterConcept,
    filterToConcept,
    handleConceptFilter,
    handleToConceptFilter,
    selectableConcepts,
    templates,
  } = use(TemplatesContext)

  const addTemplateModal = useAddTemplateModal(addTemplate)
  const templatesExport = useTemplatesExport()

  const handleConceptSelect = selector => conceptName => {
    selector(conceptName)
    return false
  }

  const data = useMemo(() => {
    if (!filterConcept && !filterToConcept) return null
    if (!filterConcept) return { filterToConcept, templates }
    if (!filterToConcept) return { filterConcept, templates }
    return { filterConcept, filterToConcept, templates }
  }, [filterConcept, filterToConcept, templates])

  const disableExport = data && data.templates.length === 0

  return (
    <Box>
      <PanelTitle title='Templates' />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Typography>Total: {count}</Typography>
          <Button disabled={disableExport} onClick={() => templatesExport(data)} sx={{ ml: 2 }}>
            Export
          </Button>
        </Box>
        <Button variant='contained' color='primary' onClick={addTemplateModal} sx={{ mr: 2 }}>
          Add
        </Button>
      </Box>
      <Stack direction='row' spacing={5} sx={{ ml: 2, mb: 1 }}>
        <ConceptSelect
          conceptName={filterConcept}
          doConceptSelect={handleConceptSelect(handleConceptFilter)}
          navigation={false}
          selectables={selectableConcepts}
          sx={{ width: 400 }}
        />
        <ToConceptSelect
          conceptName={filterToConcept}
          doConceptSelect={handleConceptSelect(handleToConceptFilter)}
          width={400}
        />
      </Stack>
    </Box>
  )
}

export default TemplatesHeader
