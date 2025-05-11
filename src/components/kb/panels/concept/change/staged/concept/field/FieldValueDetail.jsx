import { use } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'
import FieldReset from './FieldReset'

import { RESETTING } from '@/lib/constants'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const FieldValueDetail = ({ field, value }) => {
  const { confirmDiscard } = use(ConceptContext)

  const resetting =
    confirmDiscard?.type === RESET.NAME_CHANGE || confirmDiscard?.type === RESET.TO_INITIAL
      ? RESETTING.ME
      : RESETTING.OTHER

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <FieldReset field={field} />
      <FieldValueDisplay field={field} changing={resetting} value={value} />
    </Box>
  )
}

export default FieldValueDetail
