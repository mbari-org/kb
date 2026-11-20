import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import ActionIcon from '@/components/icon/ActionIcon'
import PropertyAddIcon from '@/components/icon/property/PropertyAddIcon'
import PropertyDeleteIcon from '@/components/icon/property/PropertyDeleteIcon'
import PropertyEditIcon from '@/components/icon/property/PropertyEditIcon'
import UserContext from '@/contexts/user/UserContext'
import theme from '@/lib/theme'
import color from '@/config/color.json'

const TestIcon = () => <span>icon</span>
const testColors = { ADD: '#123456', DELETE: '#345678', EDIT: '#234567', NONE: '#456789', PANEL_LINK: '#56789a' }
const testTheme = createTheme(theme, { kb: { icon: { colors: testColors } } })

const renderIcon = (icon, { isReadOnly = false } = {}) =>
  render(
    <ThemeProvider theme={testTheme}>
      <UserContext.Provider value={{ isReadOnly }}>{icon}</UserContext.Provider>
    </ThemeProvider>
  )

const hoverColors = element =>
  Array.from(document.styleSheets).flatMap(sheet =>
    Array.from(sheet.cssRules)
      .filter(rule => rule.selectorText?.endsWith(':hover') && element.matches(rule.selectorText.replace(':hover', '')))
      .map(rule => rule.style.color)
  )

const cssColor = color => {
  const element = document.createElement('span')
  element.style.color = color
  return element.style.color
}

describe('action icon colors', () => {
  it('loads icon colors from configuration', () => {
    expect(theme.kb.icon.colors).toEqual(color.COLOR.ACTION)
  })

  it.each(['ADD', 'EDIT', 'DELETE', 'PANEL_LINK'])('uses the %s color only on hover for buttons and divs', action => {
    for (const asDiv of [false, true]) {
      const { unmount } = renderIcon(<ActionIcon asDiv={asDiv} Icon={TestIcon} iconAction={action} />)
      const target = screen.getByText('icon').parentElement

      expect(target).toHaveStyle({ color: testColors.NONE })
      expect(hoverColors(target)).toContain(cssColor(testColors[action]))
      unmount()
    }
  })

  it.each([
    [PropertyAddIcon, 'ADD'],
    [PropertyEditIcon, 'EDIT'],
    [PropertyDeleteIcon, 'DELETE'],
  ])('maps property icons to their action color', (Icon, action) => {
    const { container } = renderIcon(<Icon />)
    const target = container.querySelector('svg').parentElement

    expect(target).toHaveStyle({ color: testColors.NONE })
    expect(hoverColors(target)).toContain(cssColor(testColors[action]))
  })

  it.each([
    [{ disabled: true }, {}],
    [{ restrictReadOnly: true }, { isReadOnly: true }],
  ])('does not apply action hover or invoke disabled buttons', (props, user) => {
    const onClick = vi.fn()
    renderIcon(<ActionIcon Icon={TestIcon} iconAction='EDIT' onClick={onClick} {...props} />, user)
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
    expect(hoverColors(button)).not.toContain(cssColor(testColors.EDIT))
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('does not apply action hover or invoke a disabled div', () => {
    const onClick = vi.fn()
    renderIcon(<ActionIcon asDiv Icon={TestIcon} iconAction='DELETE' onClick={onClick} restrictReadOnly />, {
      isReadOnly: true,
    })
    const target = screen.getByText('icon').parentElement

    expect(hoverColors(target)).not.toContain(cssColor(testColors.DELETE))
    fireEvent.click(target)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('preserves palette colors for unrelated icons', () => {
    renderIcon(<ActionIcon Icon={TestIcon} color='primary' />)
    const button = screen.getByRole('button')

    expect(button).toHaveStyle({ color: theme.palette.primary.main })
    expect(hoverColors(button)).toContain(cssColor(theme.palette.primary.main))
  })
})
