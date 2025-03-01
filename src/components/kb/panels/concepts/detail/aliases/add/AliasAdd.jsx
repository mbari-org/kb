import { IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { MdOutlinePlaylistAdd } from 'react-icons/md'

import useAddAlias from './useAddAlias'

const AliasAdd = () => {
  const theme = useTheme()

  const addAlias = useAddAlias()

  return (
    <IconButton
      color='main'
      onClick={addAlias}
      sx={{
        '&:hover': {
          ...theme.kb.icon.hover,
        },
        backgroundColor: theme.palette.background.paper,
        mb: 1,
      }}
    >
      <MdOutlinePlaylistAdd />
    </IconButton>
  )
}

export default AliasAdd
