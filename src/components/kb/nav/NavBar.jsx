import { use } from 'react'

import { AppBar, Box, Toolbar } from '@mui/material'

import LogoutLink from './LogoutLink'
import PanelLink from './PanelLink'
import NavHistoryLinks from '../../common/NavHistoryLinks'
import VersionDisplay from '../../common/VersionDisplay'

import panelMods from '@/components/kb/panels/modules'

const isDev = import.meta.env.DEV

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
        <Box sx={{ mb: 1.5 }}>
          <NavHistoryLinks history={panels} />
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
        {isDev && (
          <Box>
            <VersionDisplay />
          </Box>
        )}
        <LogoutLink />
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
