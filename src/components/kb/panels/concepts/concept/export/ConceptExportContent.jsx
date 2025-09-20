import { use } from 'react'
import { Stack } from '@mui/material'

import ConceptExtent from '@/components/common/concept/ConceptExtent'
import ConceptExportType from '@/components/kb/panels/concepts/concept/export/ConceptExportType'
import ConceptExportCsv from '@/components/kb/panels/concepts/concept/export/ConceptExportCsv'
import ConceptExportJson from '@/components/kb/panels/concepts/concept/export/ConceptExportJson'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { EXPORT_TYPE } from '@/lib/constants'

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

  return (
    <Stack>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <ConceptExtent
          initialValue={conceptExtent}
          onChange={handleConceptExtentChange}
          exportType={exportType}
        />
        <ConceptExportType
          value={exportType}
          onChange={handleExportTypeChange}
        />
      </Stack>
      {exportType === EXPORT_TYPE.CSV && <ConceptExportCsv />}
      {exportType === EXPORT_TYPE.JSON && <ConceptExportJson />}
    </Stack>
  )
}

export default ConceptExportContent