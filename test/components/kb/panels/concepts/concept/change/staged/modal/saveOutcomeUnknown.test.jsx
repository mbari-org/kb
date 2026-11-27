import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from 'react-error-boundary'
import { ThemeProvider } from '@mui/material/styles'

import SaveOutcomeUnknownActions from '@/components/kb/panels/concepts/concept/change/staged/modal/SaveOutcomeUnknownActions'
import useDisplaySaveOutcomeUnknown from '@/components/kb/panels/concepts/concept/change/staged/modal/useDisplaySaveOutcomeUnknown'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import kbTheme from '@/lib/theme'
import CONFIG from '@/lib/config'

const reloadConceptMock = vi.fn()

vi.mock('@/contexts/panels/concepts/staged/save/useReloadConcept', () => ({
  default: () => reloadConceptMock,
}))

describe('useDisplaySaveOutcomeUnknown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens a modal that stays open until it is reloaded', () => {
    const setModal = vi.fn()
    const wrapper = ({ children }) => <ConceptModalContext.Provider value={{ setModal }}>{children}</ConceptModalContext.Provider>
    const { result } = renderHook(() => useDisplaySaveOutcomeUnknown(), { wrapper })

    result.current()

    expect(setModal).toHaveBeenCalledWith(
      expect.objectContaining({ actions: expect.anything(), content: expect.anything(), title: expect.anything() }),
      expect.any(Function)
    )
    const refuseClose = setModal.mock.calls[0][1]
    expect(refuseClose()).toBe(false)
  })
})

describe('SaveOutcomeUnknownActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderActions = () => {
    const fallbackRender = vi.fn(() => <div>boundary</div>)
    render(
      <ThemeProvider theme={kbTheme}>
        <ErrorBoundary fallbackRender={fallbackRender}>
          <ConceptContext.Provider value={{ concept: { name: 'dingo' }, pending: () => null }}>
            <ConceptStagedContext.Provider value={{ confirmReset: null }}>
              <ConceptModalDataContext.Provider value={{ modalData: {} }}>
                <SaveOutcomeUnknownActions />
              </ConceptModalDataContext.Provider>
            </ConceptStagedContext.Provider>
          </ConceptContext.Provider>
        </ErrorBoundary>
      </ThemeProvider>
    )
    return { fallbackRender }
  }

  it('reloads the concept when Reload is clicked', async () => {
    reloadConceptMock.mockResolvedValueOnce()
    renderActions()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.RELOAD }))

    await waitFor(() => expect(reloadConceptMock).toHaveBeenCalledTimes(1))
  })

  it('shows the error boundary when the reload fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    reloadConceptMock.mockRejectedValueOnce(new Error('reload failed'))
    const { fallbackRender } = renderActions()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.RELOAD }))

    await waitFor(() => expect(fallbackRender).toHaveBeenCalled())
    expect(fallbackRender.mock.calls[0][0].error).toMatchObject({ message: 'reload failed' })
    consoleError.mockRestore()
  })
})
