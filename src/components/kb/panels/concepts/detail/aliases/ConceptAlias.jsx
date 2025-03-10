import { use, useEffect, useMemo, useState } from 'react'
import { Stack, FormControl, TextField, Select, MenuItem, InputLabel } from '@mui/material'

import { useTheme } from '@mui/material/styles'

import AliasDelete from './AliasDelete'

import useConceptDetailStyle from '../useConceptDetailStyle'
import { aliasBorder } from '@/lib/kb/concept/aliases'

import ConceptContext from '@/contexts/concept/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'
import { ALIAS_TYPES } from '@/lib/kb/concept/aliases'

import useDebounceModifyAlias from './useDebounceModifyAlias'

const ConceptAlias = ({ aliasIndex }) => {
  const theme = useTheme()

  const { editing, initialState, stagedState } = use(ConceptContext)
  const { getNames } = use(TaxonomyContext)
  const stagedAlias = useMemo(
    () => ({ ...stagedState.aliases[aliasIndex] }),
    [stagedState.aliases, aliasIndex]
  )
  const initialAlias = { ...initialState.aliases[aliasIndex] }

  console.log('stagedState alias', stagedAlias)

  // aliasUpdate is necessary due to debounce on edits
  const [aliasUpdate, setAliasUpdate] = useState(null)

  const isDeleted = stagedAlias.action === CONCEPT_STATE.ALIAS.DELETE

  const border = aliasUpdate
    ? aliasBorder(isDeleted, stagedAlias, aliasUpdate, initialAlias, theme)
    : 'none'
  const infoStyle = useConceptDetailStyle('Alias')

  const disabled = isDeleted || !editing

  const debounceModifyAlias = useDebounceModifyAlias(CONCEPT_STATE.ALIAS.EDIT)

  const handleChange = field => event => {
    if (field === 'name') {
      const names = getNames()
      if (names.includes(event.target.value)) {
        return
      }
    }

    const update = {
      ...aliasUpdate,
      alias: {
        ...aliasUpdate.alias,
        [field]: event.target.value,
      },
    }
    setAliasUpdate(update)
    debounceModifyAlias(update)
  }

  useEffect(() => {
    setAliasUpdate({
      action: stagedAlias.action,
      aliasIndex,
      alias: {
        author: stagedAlias.author,
        name: stagedAlias.name,
        nameType: stagedAlias.nameType,
      },
    })
  }, [aliasIndex, stagedAlias])

  if (!aliasUpdate) {
    return null
  }

  return (
    <Stack alignItems='center' direction='row' spacing={0} width='100%'>
      {editing && <AliasDelete aliasIndex={aliasIndex} />}
      <Stack alignItems='center' direction='row' spacing={1} width='100%' sx={{ border }}>
        <FormControl {...infoStyle} style={{ flex: 1 }}>
          <TextField
            {...infoStyle}
            disabled={disabled}
            label='Name'
            onChange={handleChange('name')}
            value={aliasUpdate.alias.name}
          />
        </FormControl>
        <FormControl {...infoStyle} style={{ flex: 1 }}>
          <TextField
            {...infoStyle}
            disabled={disabled}
            label='Author'
            onChange={handleChange('author')}
            value={aliasUpdate.alias.author}
          />
        </FormControl>
        <FormControl {...infoStyle} style={{ flex: 0.45 }}>
          <InputLabel id={`${stagedAlias.name}-name-type-label`} shrink>
            Type
          </InputLabel>
          <Select
            displayEmpty
            disabled={disabled}
            labelId={`${stagedAlias.name}-name-type-label`}
            onChange={handleChange('nameType')}
            value={aliasUpdate.alias.nameType}
          >
            {ALIAS_TYPES.map(value => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  )
}

export default ConceptAlias
