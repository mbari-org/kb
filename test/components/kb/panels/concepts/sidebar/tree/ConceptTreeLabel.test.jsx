import { render, screen } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { describe, expect, it, vi } from 'vitest'

import ConceptTreeLabel from '@/components/kb/panels/concepts/sidebar/tree/ConceptTreeLabel'
import { ACTION } from '@/lib/constants'
import theme from '@/lib/theme'

const state = vi.hoisted(() => ({ pendingAction: null, selected: true }))

vi.mock('@mui/x-tree-view/hooks', () => ({
  useTreeItemUtils: () => ({ status: { selected: state.selected } }),
}))

vi.mock('@/components/kb/panels/concepts/sidebar/tree/lib/useConceptItem', () => ({
  default: () => ({ label: 'bathyal', mediaCount: 0, pendingAction: state.pendingAction }),
}))

describe('ConceptTreeLabel', () => {
  it('uses the paper color for selected text, including pending concepts', () => {
    const testTheme = createTheme(theme, { palette: { background: { paper: '#b0b0b0' } } })
    const label = itemId => (
      <ThemeProvider theme={testTheme}>
        <ConceptTreeLabel itemId={itemId} />
      </ThemeProvider>
    )
    state.pendingAction = null
    state.selected = true
    const { rerender } = render(label('initial'))
    const text = screen.getByText('bathyal')
    expect(text).toHaveStyle({ color: testTheme.palette.background.paper })

    state.pendingAction = ACTION.EDIT
    rerender(label('pending'))
    expect(text).toHaveStyle({ color: testTheme.palette.background.paper })

    state.selected = false
    rerender(label('unselected'))
    expect(text).toHaveStyle({ color: theme.palette.primary.edit })
  })
})
