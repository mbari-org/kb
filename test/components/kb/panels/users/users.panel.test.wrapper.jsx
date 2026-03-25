import { vi } from 'vitest'
import { useCallback } from 'react'

import { ErrorBoundary } from 'react-error-boundary'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'

import kbTheme from '@/lib/theme'
import { ROLES } from '@/lib/constants/roles.js'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import RefreshContext from '@/contexts/refresh/RefreshContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

// Mock user data
const mockUsers = [
  {
    username: 'dingo',
    email: 'dingo@aqui.nada',
    role: ROLES.MAINT,
    locked: false,
  },
  {
    username: 'sky',
    email: 'sky@aqui.nada',
    role: ROLES.USER,
    locked: false,
  },
  {
    username: 'dingosky',
    email: 'dingosky@aqui.nada',
    role: ROLES.USER,
    locked: true,
  },
]

const mockPanelSelect = {
  current: () => 'Users',
  push: () => {},
  getState: () => ['Users'],
  getPosition: () => 0,
  init: () => {},
  clear: () => {},
}

export const UsersPanelTestWrapper = ({ children }) => {
  const mockAppModalValue = {
    modal: null,
    updateModal: vi.fn(),
  }

  const mockConfigValue = {
    baseUrl: 'http://localhost:8123',
    apiFns: {
      apiPayload: vi.fn(fn => fn()),
      apiCall: vi.fn(),
    },
  }

  const mockSelectedValue = {
    panels: mockPanelSelect,
    getSelected: useCallback(() => 'Users', []),
    updateSelected: useCallback(() => {}, []),
    settings: {},
    getSettings: () => ({}),
    setSettings: () => {},
  }

  const mockUserValue = {
    user: {
      username: 'testuser',
      email: 'test@aqui.nada',
      role: ROLES.ADMIN,
    },
    login: vi.fn(),
    logout: vi.fn(),
  }

  const mockPreferencesValue = {
    preferences: {},
    setPreferences: vi.fn(),
  }

  const mockRefreshValue = {
    refresh: false,
    setRefresh: vi.fn(),
  }

  const mockPanelDataValue = {
    panelDataMap: {},
    updatePanelDataMap: vi.fn(),
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={kbTheme}>
        <CssBaseline />
        <ErrorBoundary fallback={<div>Error</div>}>
          <AppModalContext.Provider value={mockAppModalValue}>
            <ConfigContext.Provider value={mockConfigValue}>
              <UserContext.Provider value={mockUserValue}>
                <SelectedContext.Provider value={mockSelectedValue}>
                  <PreferencesContext.Provider value={mockPreferencesValue}>
                    <RefreshContext.Provider value={mockRefreshValue}>
                      <PanelDataContext.Provider value={mockPanelDataValue}>{children}</PanelDataContext.Provider>
                    </RefreshContext.Provider>
                  </PreferencesContext.Provider>
                </SelectedContext.Provider>
              </UserContext.Provider>
            </ConfigContext.Provider>
          </AppModalContext.Provider>
        </ErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export { mockUsers }
