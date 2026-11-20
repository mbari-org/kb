import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { BsInfoCircleFill } from 'react-icons/bs'
import { describe, expect, it, vi } from 'vitest'

import KBInfoIcon from '@/components/icon/KBInfoIcon'
import theme from '@/lib/theme'

describe('KBInfoIcon', () => {
  it('uses a filled icon with a transparent button background, including on hover', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <KBInfoIcon />
      </ThemeProvider>
    )
    const button = screen.getByRole('button')
    const icon = container.querySelector('svg')
    const { container: reference } = render(<BsInfoCircleFill />)
    const hoverRules = Array.from(document.styleSheets).flatMap(sheet =>
      Array.from(sheet.cssRules).filter(
        rule => rule.selectorText?.endsWith(':hover') && button.matches(rule.selectorText.replace(':hover', ''))
      )
    )

    expect(button).toHaveStyle({ 'background-color': 'rgba(0, 0, 0, 0)', color: theme.palette.primary.main })
    expect(icon).toHaveAttribute('fill', 'currentColor')
    expect(icon.querySelector('path')).toHaveAttribute('d', reference.querySelector('path').getAttribute('d'))
    expect(hoverRules.some(rule => rule.style.backgroundColor === 'transparent')).toBe(true)
    expect(hoverRules.some(rule => rule.style.color === getComputedStyle(button).color)).toBe(true)
  })

  it('keeps the disabled icon transparent and non-interactive', () => {
    const onClick = vi.fn()
    render(
      <ThemeProvider theme={theme}>
        <KBInfoIcon disabled onClick={onClick} />
      </ThemeProvider>
    )
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
    expect(button).toHaveStyle({ 'background-color': 'rgba(0, 0, 0, 0)' })
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
