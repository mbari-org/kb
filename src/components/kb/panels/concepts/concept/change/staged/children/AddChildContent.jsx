import { use, useCallback, useMemo, useState } from 'react'

import { Box, FormControl, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import RankFieldInput from '@/components/kb/panels/concepts/concept/change/staged/rank/RankFieldInput'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useInputStyle from './useInputStyle'
import useStageChild from './useStageChild'

import { rankField } from '@/lib/kb/state/rank'

import { CONCEPT_RANK } from '@/lib/constants'

import { hasTrue } from '@/lib/utils'

export const ADD_CHILD_FORM_ID = 'add-child-concept-form'

const AddChildContent = () => {
  const theme = useTheme()
  const inputStyle = useInputStyle()

  const { stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ConceptModalContext)
  const { getNames } = use(TaxonomyContext)

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
      name: formChild.rankName,
      level: formChild.rankLevel,
    }),
    [formChild]
  )

  const handleStage = useStageChild()

  const isValidName = useMemo(() => {
    return !getNames().includes(formChild?.name)
  }, [formChild?.name, getNames])

  const isValidAddition = useMemo(() => {
    return !stagedState.children.some(stagedChild => stagedChild.name === formChild.name)
  }, [formChild?.name, stagedState.children])

  const nameError =
    modifiedFields.name && (formChild.name.trim() === '' || !isValidName || !isValidAddition)

  const nameHelperText = !modifiedFields.name
    ? ''
    : formChild.name.trim() === ''
    ? 'Name cannot be empty'
    : !isValidName
    ? 'Concept name already exists'
    : !isValidAddition
    ? 'Child already being added'
    : ''

  const handleChange = useCallback(
    (field, value) => {
      const updatedChild = {
        ...formChild,
        [field]: value,
      }
      setFormChild(updatedChild)

      const fieldIsModified = updatedChild[field] !== child[field]

      const updatedModifiedFields = { ...modifiedFields, [field]: fieldIsModified }
      setModifiedFields(updatedModifiedFields)

      const modified = hasTrue(updatedModifiedFields)

      setModalData(prev => ({ ...prev, child: updatedChild, modified }))
    },
    [child, formChild, modifiedFields, setModalData]
  )

  const handleFieldChange = useCallback(
    field => event => {
      handleChange(field, event.target.value)
    },
    [handleChange]
  )

  return (
    <Box component='form' id={ADD_CHILD_FORM_ID} onSubmit={handleStage}>
      <Typography variant='h6'>Add Child</Typography>
      <FormControl {...inputStyle}>
        <TextField
          error={false}
          helperText={nameError ? nameHelperText : ' '}
          label='Name'
          name='name'
          onChange={handleFieldChange('name')}
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
          onChange={handleFieldChange('author')}
          value={formChild.author}
        />
      </FormControl>
      <Stack direction='row' spacing={1.5} sx={{ mt: 4 }}>
        <RankFieldInput
          field={CONCEPT_RANK.NAME}
          initialRank={initialRank}
          rank={formRank}
          onChange={handleFieldChange(rankField(CONCEPT_RANK.NAME))}
        />
        <RankFieldInput
          field={CONCEPT_RANK.LEVEL}
          initialRank={initialRank}
          rank={formRank}
          onChange={handleFieldChange(rankField(CONCEPT_RANK.LEVEL))}
        />
      </Stack>
    </Box>
  )
}

export default AddChildContent
