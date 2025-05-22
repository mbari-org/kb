import { use } from 'react'

import { FormControlLabel, Radio, Stack } from '@mui/material'
import FieldDetail from '@/components/kb/panels/concept/change/pending/concept/FieldDetail'

import ConceptContext from '@/contexts/concept/ConceptContext'

const NameDetail = ({ pendingField }) => {
  const { concept } = use(ConceptContext)

  const pendingName = pendingField('ConceptName').find(name => name.newValue === concept.name)

  if (!pendingName) {
    return null
  }

  return (
    <Stack direction='column' spacing={0}>
      <FieldDetail key={pendingName.id} pendingField={pendingName} />
      <Stack direction='row' sx={{ ml: 8 }}>
        <FormControlLabel
          control={<Radio name='nameChangeType' value='nameOnly' defaultChecked />}
          label='Name Only'
        />
        <FormControlLabel
          control={<Radio name='nameChangeType' value='associatedData' />}
          label='Associated Data'
        />
      </Stack>
    </Stack>
  )
}

export default NameDetail
