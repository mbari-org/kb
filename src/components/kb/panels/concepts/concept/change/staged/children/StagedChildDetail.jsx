import { use, useMemo } from 'react'
import { Box } from '@mui/material'

import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { drop } from '@/lib/utils'
import { CONCEPT } from '@/lib/constants'

const StagedChildDetail = ({ stagedChild }) => {
  const { isPhylogenyRoot } = use(ConceptContext)
  const { updates } = stagedChild

  const fieldValues = useMemo(() => {
    const hiddenFields = ['name']
    if (!isPhylogenyRoot) {
      hiddenFields.push(CONCEPT.FIELD.RANK_NAME, CONCEPT.FIELD.RANK_LEVEL)
    }
    return Object.entries(drop(updates, hiddenFields))
  }, [isPhylogenyRoot, updates])

  return (
    <Box>
      {fieldValues?.map(([field, value]) => (
        <FieldValueDisplay key={field} field={field} value={value} />
      ))}
    </Box>
  )
}

export default StagedChildDetail
