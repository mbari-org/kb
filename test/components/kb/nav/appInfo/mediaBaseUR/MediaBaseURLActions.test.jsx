import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import MediaBaseURLActions from '@/components/kb/nav/appInfo/mediaBaseUR/MediaBaseURLActions'
import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import { PREFS } from '@/lib/constants/prefs'
import CONFIG from '@/text'

const renderActions = ({
  confirmCommit = false,
  mediaBaseUrl = 'https://example.org/media/',
  selectedMediaBaseUrl = '',
  urlStatus,
} = {}) => {
  const closeModal = vi.fn(() => true)
  const saveAppPreference = vi.fn(() => Promise.resolve())
  const setModalData = vi.fn()

  render(
    <ConfigContext.Provider value={{ mediaBaseUrl, saveAppPreference }}>
      <AppModalContext.Provider
        value={{
          closeModal,
          modalData: {
            confirmCommit,
            selectedMediaBaseUrl,
            urlStatus,
          },
          setModalData,
        }}
      >
        <MediaBaseURLActions />
      </AppModalContext.Provider>
    </ConfigContext.Provider>
  )

  return {
    closeModal,
    setModalData,
    saveAppPreference,
  }
}

describe('MediaBaseURLActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('enters verify state on first save click before persisting media base URL', async () => {
    const user = userEvent.setup()
    const { closeModal, saveAppPreference, setModalData } = renderActions({
      selectedMediaBaseUrl: 'https://new.example.org/assets/',
    })

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(saveAppPreference).not.toHaveBeenCalled()
    expect(closeModal).not.toHaveBeenCalled()
    expect(setModalData).toHaveBeenCalledTimes(1)
    const modalUpdater = setModalData.mock.calls[0][0]
    expect(typeof modalUpdater).toBe('function')

    const updatedData = modalUpdater({})
    expect(updatedData.confirmCommit).toBe(true)
    expect(updatedData.alert).toEqual({
      lines: CONFIG.PANELS.ABOUT_HELP.MEDIA_BASE_URL.ALERT.SAVE_CONFIRM.LINES,
      severity: CONFIG.PANELS.ABOUT_HELP.MEDIA_BASE_URL.ALERT.SAVE_CONFIRM.SEVERITY,
    })
  })

  it('saves selected media base URL when save is confirmed', async () => {
    const user = userEvent.setup()
    const { closeModal, saveAppPreference } = renderActions({
      confirmCommit: true,
      selectedMediaBaseUrl: 'https://new.example.org/assets/',
    })

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(saveAppPreference).toHaveBeenCalledWith(
      PREFS.APP.MEDIA.BASE_URL.ROOT.KEY,
      'https://new.example.org/assets/'
    )
    await waitFor(() => {
      expect(closeModal).toHaveBeenCalledWith(true)
    })
  })

  it('disables save for invalid URL input', () => {
    renderActions({
      selectedMediaBaseUrl: 'not-a-url',
    })

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('disables save when selected value matches current media base URL', () => {
    renderActions({
      mediaBaseUrl: 'https://example.org/media/',
      selectedMediaBaseUrl: 'https://example.org/media/',
    })

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('disables save while live URL check is in progress', () => {
    renderActions({
      selectedMediaBaseUrl: 'https://new.example.org/assets/',
      urlStatus: { loading: true, valid: true },
    })

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('allows save when media base URL is cleared from a non-empty current value', () => {
    renderActions({
      mediaBaseUrl: 'https://example.org/media/',
      selectedMediaBaseUrl: '',
      urlStatus: { loading: false, valid: true },
    })

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
  })
})
