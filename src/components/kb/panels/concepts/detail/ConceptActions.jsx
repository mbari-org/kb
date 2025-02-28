import { use } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { INTENT } from '@/contexts/concept/lib/edit/useEditingStateDisplay'

const ConceptActions = () => {
  const { editingStateDisplay, editing, modified, setEditing } = use(ConceptContext)

  return (
    <Box
      sx={{
        alignItems: 'center',
        bottom: 65,
        display: 'flex',
        justifyContent: 'space-between',
        left: 10,
        position: 'absolute',
        right: 15,
      }}
    >
      <Button
        color={editing ? 'cancel' : 'main'}
        onClick={() =>
          editing
            ? modified
              ? editingStateDisplay(INTENT.SHOW)
              : setEditing(false)
            : setEditing(true)
        }
        variant='contained'
      >
        {editing ? (modified ? 'Discard' : 'Cancel') : 'Edit'}
      </Button>
      {editing && modified && (
        <Button
          onClick={() => editingStateDisplay(INTENT.SHOW)}
          sx={{ margin: '0 10px' }}
          variant='contained'
        >
          Show
        </Button>
      )}
      <Button
        disabled={!editing || !modified}
        onClick={() => editingStateDisplay(INTENT.SAVE)}
        variant='contained'
      >
        Save
      </Button>
    </Box>
  )
}

export default ConceptActions
