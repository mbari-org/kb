import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import MediaBaseURLContent from '@/components/kb/nav/appInfo/mediaBaseURL/MediaBaseURLContent'
import AppModalContext from '@/contexts/app/AppModalContext'

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
        lines: ['You are about to change the media base URL.', 'Please confirm you want to continue.'],
        severity: 'success',
      },
      selectedMediaBaseURL: 'https://example.org/media/',
    })

    expect(screen.getByText('You are about to change the media base URL.')).toBeInTheDocument()
    expect(screen.getByText('Please confirm you want to continue.')).toBeInTheDocument()
  })

  it('clears verify state and alert when the media base URL changes', () => {
    const { setModalData } = renderContent({
      alert: {
        lines: ['You are about to change the media base URL.', 'Please confirm you want to continue.'],
        severity: 'success',
      },
      selectedMediaBaseURL: 'https://example.org/media/',
    })

    const input = screen.getByRole('textbox', { name: 'Media Base URL' })
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
    expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument()
  })

  it('shows "not set" placeholder and no error for empty value', () => {
    renderContent({
      selectedMediaBaseURL: '',
    })

    const input = screen.getByRole('textbox', { name: 'Media Base URL' })
    expect(input).toHaveAttribute('placeholder', 'Base URL for Media Assets')
    expect(screen.queryByText('Please enter a valid URL')).not.toBeInTheDocument()
  })

  it('performs debounced live URL check and shows inaccessible message on failure', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))

    renderContent({
      selectedMediaBaseURL: '',
    })

    const input = screen.getByRole('textbox', { name: 'Media Base URL' })
    fireEvent.change(input, { target: { value: 'https://new.example.org/assets/' } })

    expect(screen.getByText('Checking URL...')).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
      await Promise.resolve()
    })
    expect(screen.getByText('URL is not accessible')).toBeInTheDocument()
  })
})
