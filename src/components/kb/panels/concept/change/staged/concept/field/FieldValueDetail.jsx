import { use } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import FieldReset from './FieldReset'

import { RESETTING } from '@/lib/constants'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { fieldResetting } from '@/components/kb/panels/concept/change/staged/concept/staged'

const FieldValueDetail = ({ field, value }) => {
  const { confirmReset } = use(ConceptContext)

  const disabled = fieldResetting(confirmReset, field) === RESETTING.OTHER

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <FieldReset field={field} />
      <FieldValueDisplay disabled={disabled} field={field} value={value} />
    </Box>
  )
}

export default FieldValueDetail
