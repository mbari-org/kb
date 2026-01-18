import { use, useMemo } from 'react'
import { Stack, Typography } from '@mui/material'

import ConceptExtent from '@/components/common/concept/ConceptExtent'
import ConceptExportType from './ConceptExportType'
import ConceptExportCsv from './ConceptExportCsv'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EXPORT_TYPE } from '@/lib/constants/exportType.js'
import { CONCEPT } from '@/lib/constants'

const ConceptExportContent = () => {
  const { modalData, setModalData } = use(ConceptModalContext)
  const { conceptExtent, exportType } = modalData

  const handleConceptExtentChange = value => {
    setModalData(prev => ({ ...prev, conceptExtent: value }))
  }

  const handleExportTypeChange = value => {
    const validInput = value === EXPORT_TYPE.CSV
    setModalData(prev => ({ ...prev, exportType: value, validInput }))
  }

  const exportMessage = useMemo(() => {
    let message = `Export ${exportType} data for the concept`
    if (conceptExtent !== CONCEPT.EXTENT.SOLO) {
      message += ` and its ${conceptExtent}`
    }
    message += '.'
    return message
  }, [conceptExtent, exportType])

  return (
    <Stack spacing={2}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <ConceptExportType
          value={exportType}
          onChange={handleExportTypeChange}
        />
        <ConceptExtent
          initialValue={conceptExtent}
          onChange={handleConceptExtentChange}
          exportType={exportType}
        />
      </Stack>
      <Typography variant='body2' color='text.secondary'>
          {exportMessage}
      </Typography>
      { exportType === EXPORT_TYPE.CSV && <ConceptExportCsv /> }
    </Stack>
  )
}

export default ConceptExportContent