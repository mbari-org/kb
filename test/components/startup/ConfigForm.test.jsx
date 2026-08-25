import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'

import ConfigForm from '@/components/startup/ConfigForm'
import ConfigContext from '@/contexts/config/ConfigContext'
import kbTheme from '@/lib/theme'

describe('ConfigForm', () => {
  it('clears a failed Config Service submission error when editing the URL', async () => {
    const user = userEvent.setup()
    const updateConfig = vi.fn().mockResolvedValue({
      error: 'Config service: Failed access (Failed to fetch)',
    })

    render(
      <ThemeProvider theme={kbTheme}>
        <ConfigContext value={{ config: null, updateConfig }}>
          <ConfigForm configIsDirty={true} setConfigIsDirty={vi.fn()} />
        </ConfigContext>
      </ThemeProvider>
    )

    const input = screen.getByRole('textbox', { name: 'Config Service URL' })
    await user.type(input, 'https://localhost')
    await user.click(screen.getByRole('button', { name: 'Set' }))

    const error = await screen.findByText('Config service: Failed access (Failed to fetch)')
    expect(error).toHaveStyle({ color: kbTheme.palette.error.main })

    await user.type(input, '/config')

    await waitFor(() => {
      expect(screen.queryByText('Config service: Failed access (Failed to fetch)')).not.toBeInTheDocument()
    })
  })
})
