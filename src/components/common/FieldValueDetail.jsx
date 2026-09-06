import { use } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import FieldReset from '@/components/kb/panels/concepts/concept/change/staged/field/FieldReset'

import { RESETTING } from '@/lib/constants'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'

import { resettingField } from '@/components/kb/panels/concepts/concept/change/staged/reset'

const FieldValueDetail = ({ field, value }) => {
  const { confirmReset } = use(ConceptStagedContext)

  const disabled = resettingField(confirmReset, field) === RESETTING.EXTENT.OTHER

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <FieldReset field={field} />
      <FieldValueDisplay disabled={disabled} field={field} value={value} />
    </Box>
  )
}

export default FieldValueDetail
