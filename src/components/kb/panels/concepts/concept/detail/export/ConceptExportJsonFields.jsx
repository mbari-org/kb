import { use } from 'react'
import { Box } from '@mui/material'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import { OPTIONAL_FIELDS } from './useConceptData'
import ConceptExportJsonField from './ConceptExportJsonField'

const ConceptExportJsonFields = () => {
  const { modalData, setModalData } = use(ConceptModalContext)
  const includeData = modalData.includeData

  const handleAllDataChange = event => {
    setModalData(prev => ({
      ...prev,
      includeData: {
        ...includeData,
        ...Object.fromEntries(OPTIONAL_FIELDS.map(field => [field, event.target.checked])),
      },
    }))
  }

  const handleFieldChange = field => event => {
    setModalData(prev => ({
      ...prev,
      includeData: {
        ...prev.includeData,
        [field]: event.target.checked,
      },
    }))
  }

  return (
    <Box sx={{ pl: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {Object.keys(includeData).map(field => (
          <ConceptExportJsonField
            key={field}
            checked={Boolean(includeData[field])}
            field={field}
            onChange={handleFieldChange(field)}
          />
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', mt: 3 }}>
        <ConceptExportJsonField
          checked={OPTIONAL_FIELDS.every(field => includeData[field])}
          field='All data'
          onChange={handleAllDataChange}
        />
      </Box>
    </Box>
  )
}

export default ConceptExportJsonFields
