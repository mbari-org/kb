import { use, useMemo, useState } from 'react'

import { Box, FormControl, Stack, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import RankFieldInput from '@/components/kb/panels/concepts/concept/change/staged/rank/RankFieldInput'
import ModalActionText from '@/components/common/ModalActionText'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useInputStyle from './useInputStyle'
import useAddChildHandlers from './useAddChildHandlers'
import useConceptNameValidate from '@/components/kb/panels/concepts/concept/change/staged/useConceptNameValidate'

import { rankField } from '@/lib/kb/state/rank'

import { CONCEPT } from '@/lib/constants.js'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

export const ADD_CHILD_FORM_ID = 'add-child-concept-form'

const AddChildContent = () => {
  const theme = useTheme()
  const inputStyle = useInputStyle()

  const { modalData } = use(ConceptModalContext)

  const { child } = modalData

  const [formChild, setFormChild] = useState(child)

  const [modifiedFields, setModifiedFields] = useState({
    author: false,
    name: false,
    rankLevel: false,
    rankName: false,
  })

  const initialRank = useMemo(
    () => ({
      name: child.rankName,
      level: child.rankLevel,
    }),
    [child]
  )

  const formRank = useMemo(
    () => ({
      action: CONCEPT_STATE.NO_ACTION,
      name: formChild.rankName,
      level: formChild.rankLevel,
    }),
    [formChild]
  )

  const { handleStage, handleChange } = useAddChildHandlers(
    formChild,
    setFormChild,
    modifiedFields,
    setModifiedFields,
    child
  )

  const { nameError, nameHelperText } = useConceptNameValidate(formChild, modifiedFields)

  return (
    <Box component='form' id={ADD_CHILD_FORM_ID} onSubmit={handleStage}>
      <ModalActionText text='Add Child' />
      <FormControl {...inputStyle}>
        <TextField
          error={false}
          helperText={nameError ? nameHelperText : ' '}
          label='Name'
          name='name'
          onChange={handleChange('name')}
          required
          sx={{
            '& .MuiFormHelperText-root': {
              color: nameError ? theme.palette.cancel.main : 'transparent',
              margin: '15px 0 0 10px',
              lineHeight: '0',
            },
          }}
          value={formChild.name}
        />
      </FormControl>
      <FormControl {...inputStyle}>
        <TextField
          label='Author'
          name='author'
          onChange={handleChange('author')}
          value={formChild.author}
        />
      </FormControl>
      <Stack direction='row' spacing={1.5} sx={{ mt: 4 }}>
        <RankFieldInput
          field={CONCEPT.RANK.NAME}
          initialRank={initialRank}
          rank={formRank}
          onChange={handleChange(rankField(CONCEPT.RANK.NAME))}
        />
        <RankFieldInput
          field={CONCEPT.RANK.LEVEL}
          initialRank={initialRank}
          rank={formRank}
          onChange={handleChange(rankField(CONCEPT.RANK.LEVEL))}
        />
      </Stack>
    </Box>
  )
}

export default AddChildContent
