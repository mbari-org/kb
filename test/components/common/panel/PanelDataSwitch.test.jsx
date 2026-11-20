import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it, vi } from 'vitest'

import PanelDataSwitch from '@/components/common/panel/PanelDataSwitch'
import theme from '@/lib/theme'

describe('PanelDataSwitch', () => {
  it('uses a darker off thumb and lighter track, retaining on colors and switching behavior', async () => {
    const user = userEvent.setup()
    const TestSwitch = () => {
      const [checked, setChecked] = useState(false)
      return <PanelDataSwitch checked={checked} switchFn={event => setChecked(event.target.checked)} switchLabel='Available' />
    }

    render(<ThemeProvider theme={theme}><TestSwitch /></ThemeProvider>)
    const input = screen.getByRole('switch', { name: 'Available' })
    const base = input.closest('.MuiSwitch-switchBase')
    const track = base.nextElementSibling

    expect(base).toHaveStyle({ color: theme.palette.grey[700] })
    expect(track).toHaveStyle({ backgroundColor: theme.palette.grey[700], opacity: 0.5 })
    await user.click(input)
    expect(input).toBeChecked()
    expect(base).toHaveStyle({ color: theme.palette.primary.main })
    expect(track).toHaveStyle({ backgroundColor: theme.palette.primary.main, opacity: 0.5 })
    await user.click(input)
    expect(input).not.toBeChecked()
    expect(base).toHaveStyle({ color: theme.palette.grey[700] })
  })

  it('retains MUI disabled styling and behavior when off', async () => {
    const user = userEvent.setup()
    const switchFn = vi.fn()
    render(
      <ThemeProvider theme={theme}>
        <PanelDataSwitch checked={false} disabled switchFn={switchFn} switchLabel='Available' />
      </ThemeProvider>
    )
    const input = screen.getByRole('switch', { name: 'Available' })
    const base = input.closest('.MuiSwitch-switchBase')

    expect(input).toBeDisabled()
    expect(base).toHaveStyle({ color: theme.palette.grey[100] })
    expect(base.nextElementSibling).toHaveStyle({ opacity: 0.12 })
    await user.click(screen.getByText('Available'))
    expect(switchFn).not.toHaveBeenCalled()
  })
})
