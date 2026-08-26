import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { ErrorBoundary } from 'react-error-boundary'

import StartUpContent from '@/components/startup/StartUpContent'
import ConfigContext from '@/contexts/config/ConfigContext'
import UserContext from '@/contexts/user/UserContext'
import kbTheme from '@/lib/theme'

const TestWrapper = ({ children, config, userValue }) => (
  <ErrorBoundary fallback={<div>Error</div>}>
    <ThemeProvider theme={kbTheme}>
      <ConfigContext value={config}>
        <UserContext value={userValue}>
          {children}
        </UserContext>
      </ConfigContext>
    </ThemeProvider>
  </ErrorBoundary>
)

describe('StartUpContent', () => {
  it('hides Read Only Access and Login form when config is dirty or unestablished', () => {
    render(
      <TestWrapper
        config={{ config: null, updateConfig: vi.fn() }}
        userValue={{ processAuth: vi.fn() }}
      >
        <StartUpContent configIsDirty={true} handleConfigChange={vi.fn()} />
      </TestWrapper>
    )

    expect(screen.queryByRole('button', { name: 'Read Only Access' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()
  })

  it('shows Read Only Access and Login form when a valid config is established', () => {
    render(
      <TestWrapper
        config={{ config: { url: 'https://localhost/config', valid: false }, updateConfig: vi.fn() }}
        userValue={{ processAuth: vi.fn() }}
      >
        <StartUpContent configIsDirty={false} handleConfigChange={vi.fn()} />
      </TestWrapper>
    )

    expect(screen.getByRole('button', { name: 'Read Only Access' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })
})
