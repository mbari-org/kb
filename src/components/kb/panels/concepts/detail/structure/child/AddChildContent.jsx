import { use, useCallback, useMemo, useState } from 'react'

import { Box, FormControl, Stack, TextField } from '@mui/material'

import ConceptRank from '@/components/kb/panels/concepts/detail/ConceptRank'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useInputStyle from './useInputStyle'
import useStageChild from './useStageChild'

// import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import { RANK } from '@/lib/kb/concept/rank'

export const ADD_CHILD_FORM_ID = 'add-child-concept-form'

const AddChildContent = () => {
  const inputStyle = useInputStyle()

  const { stagedState } = use(ConceptContext)
  const { modalData, setModalData } = use(ModalContext)
  const { taxonomyNames } = use(TaxonomyContext)

  const { child } = modalData

  const [formChild, setFormChild] = useState(child)

  const [modifiedFields, setModifiedFields] = useState({
    author: false,
    name: false,
    rankLevel: false,
    rankName: false,
  })

  const stagedChild = useMemo(() => ({ ...stagedState.child }), [stagedState.child])

  const handleStage = useStageChild()

  const isValidName = useMemo(() => {
    return !taxonomyNames.includes(formChild?.name)
  }, [formChild?.name, taxonomyNames])

  const isValidAddition = useMemo(() => {
    return !stagedState.children.some(stagedChild => stagedChild.name === formChild.name)
  }, [formChild?.name, stagedState.children])

  const nameError = modifiedFields.name && (!isValidName || !isValidAddition)

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

      const fieldIsModified = updatedChild[field] !== stagedChild[field]

      const updatedModifiedFields = { ...modifiedFields, [field]: fieldIsModified }
      setModifiedFields(updatedModifiedFields)

      const modified = Object.values(updatedModifiedFields).some(fieldIsModified => fieldIsModified)

      setModalData(prev => ({ ...prev, child: updatedChild, modified }))
    },
    [formChild, stagedChild, modifiedFields, setModalData]
  )

  const handleFieldChange = useCallback(
    field => event => {
      handleChange(field, event.target.value)
    },
    [handleChange]
  )

  return (
    <Box component='form' id={ADD_CHILD_FORM_ID} onSubmit={handleStage}>
      <FormControl {...inputStyle}>
        <TextField
          label='Name'
          name='name'
          onChange={handleFieldChange('name')}
          required
          value={formChild.name}
          error={nameError}
          helperText={nameHelperText}
        />
      </FormControl>
      <FormControl {...inputStyle}>
        <TextField
          label='Author'
          name='author'
          onChange={handleFieldChange('author')}
          required
          value={formChild.author}
        />
      </FormControl>
      <Stack direction='row' spacing={1} sx={{ mt: 2 }}>
        <ConceptRank
          field={RANK.NAME}
          fieldValue={formChild.rankName}
          otherValue={formChild.rankLevel}
          inputStyle={inputStyle}
          onChange={handleFieldChange('rankName')}
          showApprovalButton={false}
        />
        <ConceptRank
          field={RANK.LEVEL}
          fieldValue={formChild.rankLevel}
          otherValue={formChild.rankName}
          inputStyle={inputStyle}
          onChange={handleFieldChange('rankLevel')}
          showApprovalButton={false}
        />
      </Stack>
    </Box>
  )
}

export default AddChildContent
