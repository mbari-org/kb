import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, IconButton } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

vi.mock('@/contexts/panel/modal', () => ({
  usePanelModalDataContext: () => ({ modalData: { item: {} } }),
  usePanelModalOperationsContext: () => ({ beginProcessing: vi.fn(), closeModal: vi.fn() }),
}))

vi.mock('@/contexts/panels/history/useHistoryUpdatePending', () => ({
  default: () => vi.fn(),
}))

vi.mock('@/contexts/panels/concepts/pending/useConceptUpdatePending', () => ({
  default: () => vi.fn(),
}))

vi.mock('@/components/kb/panels/concepts/concept/detail/export/useConceptExportModal', () => ({
  default: () => vi.fn(),
}))

vi.mock('@/components/kb/panels/concepts/concept/detail/export/useConceptExportCsv', () => ({
  default: () => vi.fn(),
}))

vi.mock('@/components/kb/panels/concepts/concept/detail/export/useConceptExportJson', () => ({
  default: () => vi.fn(),
}))

import theme from '@/lib/theme'
import color from '@/config/color.json'
import CONFIG from '@/lib/config'
import { PENDING } from '@/lib/constants/pending'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import UserContext from '@/contexts/user/UserContext'
import PendingActions from '@/components/kb/panels/concepts/concept/change/pending/modal/PendingActions'
import HistoryPendingActions from '@/components/kb/panels/history/pending/PendingItemActions'
import PanelDataExport from '@/components/common/panel/PanelDataExport'
import ConceptExport from '@/components/kb/panels/concepts/sidebar/select/ConceptExport'
import ConceptExportActions from '@/components/kb/panels/concepts/concept/detail/export/ConceptExportActions'

const buttonVariables = (element, property = '--variant-containedBg') =>
  Array.from(document.styleSheets).flatMap(sheet =>
    Array.from(sheet.cssRules)
      .filter(rule => rule.selectorText && element.matches(rule.selectorText))
      .map(rule => rule.style.getPropertyValue(property).trim())
      .filter(Boolean)
  )

const hoverButtonVariables = element =>
  Array.from(document.styleSheets).flatMap(sheet =>
    Array.from(sheet.cssRules).flatMap(rule =>
      rule.cssRules
        ? Array.from(rule.cssRules)
          .filter(nested => nested.selectorText?.endsWith(':hover') &&
            element.matches(nested.selectorText.replace(':hover', '')))
          .map(nested => nested.style.getPropertyValue('--variant-containedBg').trim())
          .filter(Boolean)
        : []
    )
  )

describe('button colors', () => {
  it.each([
    [undefined, 'MAIN'],
    ['primary', 'MAIN'],
    ['main', 'MAIN'],
    ['cancel', 'CANCEL'],
    ['approve', 'APPROVE'],
    ['reject', 'REJECT'],
    ['edit', 'EDIT'],
    ['pending', 'PENDING'],
    ['export', 'EXPORT'],
  ])('uses the configured %s button color', (buttonColor, setting) => {
    render(
      <ThemeProvider theme={theme}>
        <Button color={buttonColor} variant='contained'>Action</Button>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    const palette = createTheme().palette
    const contrastText = palette.getContrastText(color.COLOR.BUTTON[setting])
    expect(buttonVariables(button).at(-1)).toBe(color.COLOR.BUTTON[setting])
    expect(buttonVariables(button, '--variant-containedColor').at(-1))
      .toBe(contrastText === palette.common.white ? color.COLOR.BACKGROUND : contrastText)
    expect(buttonVariables(button, '--variant-textColor').at(-1)).toBe(color.COLOR.BUTTON[setting])
    expect(buttonVariables(button, '--variant-outlinedColor').at(-1)).toBe(color.COLOR.BUTTON[setting])
    const hoverColor = createTheme().palette.augmentColor({ color: { main: color.COLOR.BUTTON[setting] } }).dark
    expect(hoverButtonVariables(button).at(-1)).toBe(hoverColor)
  })

  it('retains the disabled text color', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button color='edit' disabled variant='contained'>Action</Button>
      </ThemeProvider>
    )

    expect(screen.getByRole('button')).toHaveStyle({ color: theme.palette.action.disabled })
  })

  it('does not apply button colors to icon buttons or other palette consumers', () => {
    render(
      <ThemeProvider theme={theme}>
        <IconButton color='cancel' aria-label='icon' />
      </ThemeProvider>
    )

    expect(theme.palette.primary.main).toBe(color.COLOR.MAIN)
    expect(theme.palette.cancel.main).toBe(color.COLOR.CANCEL)
    expect(buttonVariables(screen.getByRole('button'))).not.toContain(color.COLOR.BUTTON.CANCEL)
  })

  it('uses approval and rejection colors for pending history actions and confirmation', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <HistoryPendingActions />
      </ThemeProvider>
    )

    const approve = screen.getByRole('button', { name: CONFIG.BUTTON.APPROVE })
    const reject = screen.getByRole('button', { name: CONFIG.BUTTON.REJECT })
    expect(buttonVariables(approve).at(-1)).toBe(color.COLOR.BUTTON.APPROVE)
    expect(buttonVariables(reject).at(-1)).toBe(color.COLOR.BUTTON.REJECT)

    await user.click(approve)
    const confirm = screen.getByRole('button', { name: CONFIG.BUTTON.CONFIRM })
    expect(buttonVariables(confirm).at(-1)).toBe(color.COLOR.BUTTON.APPROVE)
    expect(screen.queryByRole('button', { name: CONFIG.BUTTON.REJECT })).not.toBeInTheDocument()
  })

  it('uses approval and rejection colors for pending concept actions', () => {
    const pending = key => key === PENDING.DATA.CONFIRM ? null : []
    render(
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ isAdmin: true }}>
          <ConceptContext.Provider value={{ concept: { name: 'test' }, pending, setPendingConfirm: vi.fn() }}>
            <ConceptStagedContext.Provider value={{ confirmReset: null }}>
              <ConceptModalContext.Provider value={{ closeModal: vi.fn() }}>
                <ConceptModalDataContext.Provider value={{ modalData: {} }}>
                  <PendingActions />
                </ConceptModalDataContext.Provider>
              </ConceptModalContext.Provider>
            </ConceptStagedContext.Provider>
          </ConceptContext.Provider>
        </UserContext.Provider>
      </ThemeProvider>
    )

    expect(buttonVariables(screen.getByRole('button', { name: CONFIG.BUTTON.APPROVE_ALL })).at(-1))
      .toBe(color.COLOR.BUTTON.APPROVE)
    expect(buttonVariables(screen.getByRole('button', { name: CONFIG.BUTTON.REJECT_ALL })).at(-1))
      .toBe(color.COLOR.BUTTON.REJECT)
  })

  it('uses the export color for panel, concept, and export confirmation buttons', () => {
    render(
      <ThemeProvider theme={theme}>
        <ConceptContext.Provider value={{ pending: () => null }}>
          <ConceptStagedContext.Provider value={{ confirmReset: null }}>
            <ConceptModalContext.Provider value={{ closeModal: vi.fn() }}>
              <ConceptModalDataContext.Provider value={{ modalData: {} }}>
                <PanelDataExport count={1} exportButtonLabel={CONFIG.BUTTON.EXPORT} exportFn={vi.fn()} />
                <ConceptExport />
                <ConceptExportActions />
              </ConceptModalDataContext.Provider>
            </ConceptModalContext.Provider>
          </ConceptStagedContext.Provider>
        </ConceptContext.Provider>
      </ThemeProvider>
    )

    const buttons = screen.getAllByRole('button', { name: CONFIG.BUTTON.EXPORT })
    expect(buttons).toHaveLength(3)
    for (const button of buttons) {
      expect(buttonVariables(button).at(-1)).toBe(color.COLOR.BUTTON.EXPORT)
    }
  })
})
