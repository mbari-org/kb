import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from 'react-error-boundary'
import { ThemeProvider } from '@mui/material/styles'

import StagedActions from '@/components/kb/panels/concepts/concept/change/staged/modal/StagedActions'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import RefreshContext from '@/contexts/refresh/RefreshContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import UserContext from '@/contexts/user/UserContext'

import kbTheme from '@/lib/theme'
import CONFIG from '@/lib/config'

const SAVE = CONFIG.PANELS.CONCEPTS.BUTTON.SAVE

const saveStagedMock = vi.fn()
const displaySaveOutcomeUnknownMock = vi.fn()

vi.mock('@/contexts/panels/concepts/staged/save/useSaveStaged', () => ({
  default: () => saveStagedMock,
}))

vi.mock('@/components/kb/panels/concepts/concept/change/staged/modal/useDisplaySaveOutcomeUnknown', () => ({
  default: () => displaySaveOutcomeUnknownMock,
}))

const renderStagedActions = () => {
  const spies = {
    fallbackRender: vi.fn(() => <div>boundary</div>),
    setGuardedAction: vi.fn(),
    updateSelected: vi.fn(),
  }

  render(
    <ThemeProvider theme={kbTheme}>
      <ErrorBoundary fallbackRender={spies.fallbackRender}>
        <ConceptContext.Provider
          value={{ concept: { name: 'dingo' }, initialState: {}, pending: () => null, setEditing: vi.fn() }}
        >
          <ConceptStagedContext.Provider value={{ confirmReset: null, modifyConcept: vi.fn(), stagedState: {} }}>
            <ConceptModalContext.Provider value={{ closeModal: vi.fn() }}>
              <ConceptModalDataContext.Provider value={{ modalData: {} }}>
                <RefreshContext.Provider value={{ refresh: vi.fn() }}>
                  <SelectedContext.Provider value={{ updateSelected: spies.updateSelected }}>
                    <SelectedSettingsContext.Provider value={{ updateSettings: vi.fn() }}>
                      <UserContext.Provider value={{ logout: vi.fn(), setGuardedAction: spies.setGuardedAction }}>
                        <StagedActions intent={SAVE} />
                      </UserContext.Provider>
                    </SelectedSettingsContext.Provider>
                  </SelectedContext.Provider>
                </RefreshContext.Provider>
              </ConceptModalDataContext.Provider>
            </ConceptModalContext.Provider>
          </ConceptStagedContext.Provider>
        </ConceptContext.Provider>
      </ErrorBoundary>
    </ThemeProvider>
  )

  return spies
}

describe('StagedActions save', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens the save-outcome-unknown modal instead of the error boundary when the outcome is unknown', async () => {
    saveStagedMock.mockRejectedValueOnce({
      title: 'Concept Save Error',
      message: 'Failed to save changes to concept dingo in fields: name',
      details: { outcomeUnknown: true },
      original: { title: 'Server Error', status: 500 },
    })
    const spies = renderStagedActions()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: SAVE }))

    await waitFor(() => expect(displaySaveOutcomeUnknownMock).toHaveBeenCalledTimes(1))
    expect(spies.setGuardedAction).toHaveBeenCalledWith(null)
    expect(spies.fallbackRender).not.toHaveBeenCalled()
    expect(spies.updateSelected).not.toHaveBeenCalled()
  })

  it('shows the error boundary when the write was not applied', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    saveStagedMock.mockRejectedValueOnce({
      title: 'Concept Save Error',
      message: 'Failed to save changes to concept dingo in fields: name',
      details: { outcomeUnknown: false },
      original: { title: 'Bad Request', status: 400 },
    })
    const spies = renderStagedActions()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: SAVE }))

    await waitFor(() => expect(spies.fallbackRender).toHaveBeenCalled())
    expect(spies.fallbackRender.mock.calls[0][0].error).toMatchObject({
      title: 'Concept Save Error',
      details: { outcomeUnknown: false },
    })
    expect(displaySaveOutcomeUnknownMock).not.toHaveBeenCalled()
    expect(spies.setGuardedAction).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
