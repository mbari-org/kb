import { use, useState } from 'react'
import { Box, FormControl, TextField } from '@mui/material'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ModalContext from '@/contexts/modal/ModalContext'

import useHandleMediaSubmit from './useHandleMediaSubmit'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/concept'

export const ADD_ALIAS_FORM_ID = 'add-alias-form'

const AddAliasContent = ({ aliasIndex }) => {
  const { editingState, modifyConcept } = use(ConceptContext)
  const { setModal } = use(ModalContext)

  const [editedAlias, setEditedAlias] = useState({
    action: CONCEPT_STATE.ALIAS_ADD,
    author: '',
    name: '',
    nameType: '',
  })

  const handleChange = field => event => {
    const newState = {
      ...editedAlias,
      [field]: event.target.value,
    }
    setEditedAlias(newState)
    modifyConcept({
      type: CONCEPT_STATE.ALIAS_EDIT,
      update: newState,
    })
  }
  const handleSubmit = useHandleMediaSubmit(aliasIndex, {}, setModal)

  return (
    <Box component='form' id={ADD_ALIAS_FORM_ID} onSubmit={handleSubmit}>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Alias'
          name='alias'
          onChange={handleChange('name')}
          required
          value={editedAlias.name}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Credit'
          name='credit'
          onChange={handleChange('author')}
          required
          value={editedAlias.author}
        />
      </FormControl>
      <FormControl fullWidth margin='normal'>
        <TextField
          label='Caption'
          name='caption'
          onChange={handleChange('nameType')}
          value={editedAlias.nameType}
        />
      </FormControl>
    </Box>
  )
}

export default AddAliasContent
