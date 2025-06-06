import { use } from 'react'

import { AppBar, Box, Toolbar } from '@mui/material'

import LogoutLink from './LogoutLink'
import PanelLink from './PanelLink'
import HistoryNavLinks from '../../common/HistoryNavLinks'

import panelMods from '@/components/kb/panels/modules'

import AuthContext from '@/contexts/auth/AuthContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { isAdmin } from '@/lib/auth/role'

const NavBar = ({ selectPanel }) => {
  const { user } = use(AuthContext)
  const { panels } = use(SelectedContext)

  const activePanel = panels.current()

  const panelNames = isAdmin(user)
    ? panelMods.map(({ name }) => name)
    : panelMods.map(({ name }) => name).filter(name => name !== 'Users')

  return (
    <AppBar
      position='static'
      sx={{
        height: '50px',
        backgroundColor: theme => theme.palette.primary.dark,
      }}
    >
      <Toolbar>
        <Box sx={{ mt: -1.5 }}>
          <HistoryNavLinks history={panels} />
        </Box>
        {panelNames.map(name => (
          <PanelLink
            id={`nav-link-${name}`}
            isActive={name === activePanel}
            key={name}
            name={name}
            selectPanel={selectPanel}
          />
        ))}
        <Box style={{ flexGrow: 1 }} />
        <LogoutLink sx={{ mt: -1.5 }} />
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
