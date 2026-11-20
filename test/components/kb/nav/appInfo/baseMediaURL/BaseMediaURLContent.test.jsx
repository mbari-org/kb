import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import MediaBaseURLContent from '@/components/kb/nav/appInfo/mediaBaseURL/MediaBaseURLContent'
import AppModalContext from '@/contexts/app/AppModalContext'
import CONFIG from '@/lib/config'

vi.mock('@/config/panels/concepts/modals/media/url.json', async importOriginal => {
  const original = await importOriginal()
  return {
    default: {
      ...original.default,
      CHECKING: 'Checking configured URL',
      INACCESSIBLE_ERROR: 'Configured inaccessible URL',
      INVALID_URL_ERROR: 'Configured invalid URL',
    },
  }
})

const { FIELD_LABEL, DESCRIPTION, DETAIL } = CONFIG.APP_INFO.MEDIA_URL
const { SAVE_CONFIRM } = CONFIG.APP_INFO.MEDIA_URL.EDIT
const { URL } = CONFIG.PANELS.CONCEPTS.MODALS.MEDIA

const renderContent = ({ alert = null, selectedMediaBaseURL = '' } = {}) => {
  const setModalData = vi.fn()

  const TestProvider = ({ children }) => {
    const [modalData, setModalDataState] = useState({
      alert,
      confirmCommit: Boolean(alert),
      selectedMediaBaseURL,
    })

    const handleSetModalData = updater => {
      setModalData(updater)
      setModalDataState(prev => (typeof updater === 'function' ? updater(prev) : updater))
    }

    return (
      <AppModalContext.Provider
        value={{
          modalData,
          setModalData: handleSetModalData,
        }}
      >
        {children}
      </AppModalContext.Provider>
    )
  }

  render(
    <TestProvider>
      <MediaBaseURLContent />
    </TestProvider>
  )

  return { setModalData }
}

describe('MediaBaseURLContent', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('renders alert lines when an alert exists in modal data', () => {
    renderContent({
      alert: {
        lines: SAVE_CONFIRM.LINES,
        severity: SAVE_CONFIRM.SEVERITY,
      },
      selectedMediaBaseURL: 'https://example.org/media/',
    })

    SAVE_CONFIRM.LINES.forEach(line => {
      expect(screen.getByText(line)).toBeInTheDocument()
    })
  })

  it('clears verify state and alert when the media base URL changes', () => {
    const { setModalData } = renderContent({
      alert: {
        lines: SAVE_CONFIRM.LINES,
        severity: SAVE_CONFIRM.SEVERITY,
      },
      selectedMediaBaseURL: 'https://example.org/media/',
    })

    const input = screen.getByRole('textbox', { name: FIELD_LABEL })
    fireEvent.change(input, { target: { value: 'https://new.example.org/assets/' } })

    expect(setModalData).toHaveBeenCalled()
    const updater = setModalData.mock.calls[setModalData.mock.calls.length - 1][0]
    expect(typeof updater).toBe('function')
    expect(updater({})).toEqual({
      alert: null,
      confirmCommit: false,
      selectedMediaBaseURL: 'https://new.example.org/assets/',
      urlStatus: { loading: true, valid: true },
    })
  })

  it('shows validation helper text for invalid URL values', () => {
    renderContent({
      selectedMediaBaseURL: 'not-a-url',
    })
    expect(screen.getByText(URL.INVALID_URL_ERROR)).toBeInTheDocument()
  })

  it('shows no placeholder and no error for empty value', () => {
    renderContent({
      selectedMediaBaseURL: '',
    })

    const input = screen.getByRole('textbox', { name: FIELD_LABEL })
    expect(input).not.toHaveAttribute('placeholder')
    expect(screen.queryByText(URL.INVALID_URL_ERROR)).not.toBeInTheDocument()
  })

  it('renders media description and detail text from app info config', () => {
    renderContent({ selectedMediaBaseURL: '' })
    expect(screen.getByText(DESCRIPTION)).toBeInTheDocument()
    expect(screen.getByText(DETAIL)).toBeInTheDocument()
  })

  it('performs debounced live URL check and shows inaccessible message on failure', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))

    renderContent({
      selectedMediaBaseURL: '',
    })

    const input = screen.getByRole('textbox', { name: FIELD_LABEL })
    fireEvent.change(input, { target: { value: 'https://new.example.org/assets/' } })

    expect(screen.getByText(URL.CHECKING)).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
      await Promise.resolve()
    })
    expect(screen.getByText(URL.INACCESSIBLE_ERROR)).toBeInTheDocument()
  })

  it('clears the helper message after a successful URL check', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({}))
    renderContent()

    const input = screen.getByRole('textbox', { name: FIELD_LABEL })
    fireEvent.change(input, { target: { value: 'https://new.example.org/assets/' } })
    expect(screen.getByText(URL.CHECKING)).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    expect(screen.queryByText(URL.CHECKING)).not.toBeInTheDocument()
    expect(screen.queryByText(URL.INACCESSIBLE_ERROR)).not.toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })
})
