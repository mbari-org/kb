import { use, useMemo } from 'react'
import { Box, Typography } from '@mui/material'

import PendingButtons from '@/components/kb/panels/concept/change/pending/PendingButtons'
import FieldValueDisplay from '@/components/common/FieldValueDisplay'

import { fieldSx } from '@/components/common/format'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { capitalize, pick } from '@/lib/util'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL
const { ALIASES } = PENDING.GROUP

const AliasDetail = ({ pendingAlias }) => {
  const { confirmPending } = use(ConceptContext)

  const pendingAction = capitalize(pendingAlias.action.toLowerCase())

  const approval = useMemo(() => {
    if (!confirmPending) {
      return null
    }
    if (confirmPending?.group === ALIASES || confirmPending?.pendingItemId === pendingAlias.id) {
      return confirmPending.approval
    }
    return OTHER
  }, [confirmPending, pendingAlias.id])

  const aliasSx = approval === OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx
  const disabled = approval === OTHER

  const aliasName = useMemo(() => {
    if (pendingAlias.action === 'ADD') {
      return pendingAlias.newValue
    }
    if (pendingAlias.action === 'DELETE') {
      return pendingAlias.oldValue
    }
    return ''
  }, [pendingAlias])

  const aliasValues = useMemo(() => {
    const values = Object.entries(pick(pendingAlias, ['creatorName', 'creationTimestamp']))
    return values
    // if (pendingAlias.action === 'ADD') {
    //   return { ...values, newValue: pendingAlias.newValue }
    // }
    // if (pendingAlias.action === 'DELETE') {
    //   return pick(pendingAlias, ['oldValue'])
    // }
    // return pick(pendingAlias, ['oldValue', 'newValue'])
  }, [pendingAlias])

  return (
    <Box
      sx={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        mt: 0.5,
      }}
    >
      <Box sx={{ alignItems: 'center', display: 'flex', ml: 3.4 }}>
        <PendingButtons approval={approval} pendingItemId={pendingAlias.id} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={aliasSx}>{pendingAction}:</Typography>
          <Typography sx={{ ...aliasSx, fontWeight: 'bold', ml: 1 }}>{aliasName}</Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 8.5 }}>
        {aliasValues?.map(([field, value]) => (
          <FieldValueDisplay key={field} disabled={disabled} field={field} value={value} />
        ))}
      </Box>
    </Box>
  )
}

export default AliasDetail
