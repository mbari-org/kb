import { use } from 'react'
import { Stack } from '@mui/material'

import ConceptAliases from './detail/ConceptAliases'
import ConceptAuthor from './detail/ConceptAuthor'
import ConceptMedia from './detail/media/ConceptMedia'
import ConceptName from './detail/ConceptName'
import ConceptRank from './detail/ConceptRank'

import { RANK } from '@/lib/kb/concept/rank'

import ConceptContext from '@/contexts/concept/ConceptContext'

const ConceptDetail = () => {
  const { editingState, initialState } = use(ConceptContext)
  const levelValue = editingState[RANK.LEVEL] || initialState[RANK.LEVEL]
  const nameValue = editingState[RANK.NAME] || initialState[RANK.NAME]

  return (
    <Stack direction='row' spacing={1.5}>
      <ConceptMedia />
      <Stack direction='column' spacing={2} sx={{ flex: '1', ml: 1, mr: 1, textAlign: 'left' }}>
        <ConceptName />
        <ConceptAuthor />
        <Stack direction='row' spacing={2}>
          <ConceptRank field={RANK.NAME} otherValue={levelValue} />
          <ConceptRank field={RANK.LEVEL} otherValue={nameValue} />
        </Stack>
        <ConceptAliases />
      </Stack>
    </Stack>
  )
}

export default ConceptDetail
