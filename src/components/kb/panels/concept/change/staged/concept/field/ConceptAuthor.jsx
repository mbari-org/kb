import { use, useCallback, useEffect, useState } from 'react'
import { alpha, useTheme } from '@mui/material/styles'

import { FormControl, TextField } from '@mui/material'

import ConceptContext from '@/contexts/concept/ConceptContext'
import { updateInfo } from '@/contexts/concept/staged/edit/stateUpdates'

import useConceptDetailStyle from '@/components/kb/panels/concept/change/staged/useConceptDetailStyle'
import useDebounce from '@/components/hooks/useDebounce'

import { CONCEPT_STATE } from '@/lib/constants'

const ConceptAuthor = () => {
  const theme = useTheme()
  const { stagedState, modifyConcept, initialState } = use(ConceptContext)
  const { hasUpdated } = updateInfo(initialState, stagedState)

  const [author, setAuthor] = useState('')

  const modifyAuthor = useCallback(
    author => {
      modifyConcept({
        type: CONCEPT_STATE.FIELD.SET,
        update: { field: 'author', value: author },
      })
    },
    [modifyConcept]
  )

  const debouncedAuthor = useDebounce(modifyAuthor)

  const infoStyle = useConceptDetailStyle('Author')

  const handleChange = useCallback(
    event => {
      setAuthor(event.target.value)
      debouncedAuthor(event.target.value)
    },
    [debouncedAuthor]
  )

  useEffect(() => {
    setAuthor(stagedState.author)
  }, [stagedState.author])

  return (
    <FormControl
      sx={{
        backgroundColor: hasUpdated('author')
          ? alpha(theme.palette.edit.light, 0.2)
          : theme.palette.primary.light,
        borderRadius: 1,
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <TextField
        {...infoStyle}
        label='Author'
        onChange={handleChange}
        value={author}
        sx={{
          '& .MuiInputBase-input': {
            backgroundColor: 'transparent',
          },
          '& .MuiInputBase-input.Mui-disabled': {
            backgroundColor: 'transparent',
          },
        }}
      />
    </FormControl>
  )
}

export default ConceptAuthor
