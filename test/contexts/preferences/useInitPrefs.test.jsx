import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import useInitPrefs from '@/contexts/preferences/useInitPrefs'
import { checkConcept } from '@/lib/api/concept'

vi.mock('@/lib/api/concept', () => ({
  checkConcept: vi.fn(),
}))

const createSelection = () => ({
  getPosition: vi.fn(() => 0),
  getState: vi.fn(() => []),
  init: vi.fn(),
})

const createArgs = overrides => ({
  config: { url: 'http://example.test' },
  conceptSelection: createSelection(),
  createPreferences: vi.fn(),
  getPreferences: vi.fn(async () => ({
    concepts: { state: ['root'], position: 0 },
    panels: { state: ['Concepts'], position: 0 },
    settings: {},
  })),
  panelSelection: createSelection(),
  preferencesInitialized: false,
  getSettings: vi.fn(() => ({})),
  getSettingsRef: { current: null },
  onInitSettingsRef: { current: vi.fn() },
  setDirtyFlags: vi.fn(),
  setIsLoading: vi.fn(),
  setPreferencesInitialized: vi.fn(),
  setServerPreferencesExist: vi.fn(),
  showBoundary: vi.fn(),
  rootName: 'root',
  updatePreferences: vi.fn(),
  user: { name: 'tester' },
  ...overrides,
})

describe('useInitPrefs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deduplicates and filters concept history state by validating concepts from API', async () => {
    checkConcept.mockImplementation(async (_config, conceptName) => conceptName !== 'deleted')

    const args = createArgs({
      getPreferences: vi.fn(async () => ({
        concepts: {
          state: ['root', 'dingo', 'dingo', 'deleted', 'object', 'dingo', 'deleted'],
          position: 5,
        },
        panels: { state: ['Concepts'], position: 0 },
        settings: {},
      })),
    })

    renderHook(() => useInitPrefs(args))

    await waitFor(() => {
      expect(args.conceptSelection.init).toHaveBeenCalled()
      expect(args.setPreferencesInitialized).toHaveBeenCalledWith(true)
    })

    expect(checkConcept).toHaveBeenCalledTimes(4)
    expect(args.conceptSelection.init).toHaveBeenCalledWith({
      state: ['root', 'dingo', 'dingo', 'object', 'dingo'],
      position: 4,
    })
    expect(args.updatePreferences).toHaveBeenCalledWith('concepts', {
      state: ['root', 'dingo', 'dingo', 'object', 'dingo'],
      position: 4,
    })
  })

  it('keeps normalized concepts unchanged when all are unique and valid', async () => {
    checkConcept.mockResolvedValue(true)

    const args = createArgs({
      getPreferences: vi.fn(async () => ({
        concepts: {
          state: ['root', 'dingo', 'object'],
          position: 1,
        },
        panels: { state: ['Concepts'], position: 0 },
        settings: {},
      })),
    })

    renderHook(() => useInitPrefs(args))

    await waitFor(() => {
      expect(args.conceptSelection.init).toHaveBeenCalledWith({
        state: ['root', 'dingo', 'object'],
        position: 1,
      })
    })

    expect(args.updatePreferences).not.toHaveBeenCalledWith('concepts', expect.anything())
  })

  it('adjusts concept position when a deleted concept appears before the current position', async () => {
    checkConcept.mockImplementation(async (_config, conceptName) => conceptName !== 'deleted')

    const args = createArgs({
      getPreferences: vi.fn(async () => ({
        concepts: {
          state: ['root', 'deleted', 'dingo', 'object'],
          position: 2,
        },
        panels: { state: ['Concepts'], position: 0 },
        settings: {},
      })),
    })

    renderHook(() => useInitPrefs(args))

    await waitFor(() => {
      expect(args.conceptSelection.init).toHaveBeenCalledWith({
        state: ['root', 'dingo', 'object'],
        position: 1,
      })
    })

    expect(args.updatePreferences).toHaveBeenCalledWith('concepts', {
      state: ['root', 'dingo', 'object'],
      position: 1,
    })
  })

  it('falls back to taxonomy root when normalization removes all concepts', async () => {
    checkConcept.mockResolvedValue(false)
    const args = createArgs({
      getPreferences: vi.fn(async () => ({
        concepts: {
          state: ['deleted-a', 'deleted-b'],
          position: 1,
        },
        panels: { state: ['Concepts'], position: 0 },
        settings: {},
      })),
    })

    renderHook(() => useInitPrefs(args))

    await waitFor(() => {
      expect(args.conceptSelection.init).toHaveBeenCalledWith({
        state: ['root'],
        position: 0,
      })
    })

    expect(args.updatePreferences).toHaveBeenCalledWith('concepts', {
      state: ['root'],
      position: 0,
    })
  })

  it('sends initialization failures to the error boundary and clears loading state', async () => {
    const initError = new Error('boom')
    const args = createArgs({
      getPreferences: vi.fn(async () => {
        throw initError
      }),
    })

    renderHook(() => useInitPrefs(args))

    await waitFor(() => {
      expect(args.showBoundary).toHaveBeenCalledWith(initError)
      expect(args.setIsLoading).toHaveBeenCalledWith(false)
    })

    expect(args.setIsLoading).toHaveBeenCalledWith(true)
    expect(args.setPreferencesInitialized).not.toHaveBeenCalled()
  })
})
