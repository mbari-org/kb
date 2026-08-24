import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import useInitPrefs from '@/contexts/preferences/useInitPrefs'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const createSelection = ({ position = 0, state = [] } = {}) => ({
  getPosition: vi.fn(() => position),
  getState: vi.fn(() => state),
  init: vi.fn(),
})

const createCheckConceptName = (validNames = ['root', 'dingo', 'object']) => {
  const valid = new Set(validNames)
  return vi.fn(conceptName => valid.has(conceptName))
}

const createArgs = overrides => ({
  conceptSelection: createSelection(),
  createPreferences: vi.fn(),
  getPreferences: vi.fn(async () => ({
    concepts: { state: ['root'], position: 0 },
    panels: { state: ['Concepts'], position: 0 },
    settings: {},
  })),
  panelSelection: createSelection({ state: ['Concepts'] }),
  preferencesInitialized: false,
  getSettings: vi.fn(() => ({})),
  getSettingsRef: { current: null },
  onInitSettingsRef: { current: vi.fn() },
  setDirtyFlags: vi.fn(),
  setIsLoading: vi.fn(),
  setPreferencesInitialized: vi.fn(),
  setServerPreferencesExist: vi.fn(),
  showBoundary: vi.fn(),
  updatePreferences: vi.fn(),
  user: { name: 'tester' },
  ...overrides,
})

const renderUseInitPrefs = (args, taxonomy = {}) => {
  const taxonomyValue = {
    checkConceptName: createCheckConceptName(),
    rootName: 'root',
    ...taxonomy,
  }

  return {
    ...renderHook(() => useInitPrefs(args), {
      wrapper: ({ children }) => <TaxonomyContext value={taxonomyValue}>{children}</TaxonomyContext>,
    }),
    taxonomyValue,
  }
}

describe('useInitPrefs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('filters concept history state by taxonomy names', async () => {
    const checkConceptName = createCheckConceptName(['root', 'dingo', 'object'])

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

    const { taxonomyValue } = renderUseInitPrefs(args, { checkConceptName })

    await waitFor(() => {
      expect(args.conceptSelection.init).toHaveBeenCalled()
      expect(args.setPreferencesInitialized).toHaveBeenCalledWith(true)
    })

    expect(taxonomyValue.checkConceptName).toHaveBeenCalled()
    expect(args.conceptSelection.init).toHaveBeenCalledWith({
      state: ['root', 'dingo', 'object', 'dingo'],
      position: 3,
    })
    expect(args.updatePreferences).toHaveBeenCalledWith('concepts', {
      state: ['root', 'dingo', 'object', 'dingo'],
      position: 3,
    })
  })

  it('collapses adjacent duplicates created by removing missing concepts', async () => {
    const checkConceptName = createCheckConceptName([
      'object',
      'behavior',
      'NetCDF',
      'wood',
    ])

    const args = createArgs({
      getPreferences: vi.fn(async () => ({
        concepts: {
          state: ['object', 'behavior', 'CDF', 'behavior', 'NetCDF', 'CDF', 'wood'],
          position: 4,
        },
        panels: { state: ['Concepts'], position: 0 },
        settings: {},
      })),
    })

    renderUseInitPrefs(args, { checkConceptName, rootName: 'object' })

    await waitFor(() => {
      expect(args.conceptSelection.init).toHaveBeenCalledWith({
        state: ['object', 'behavior', 'NetCDF', 'wood'],
        position: 2,
      })
    })

    expect(args.updatePreferences).toHaveBeenCalledWith('concepts', {
      state: ['object', 'behavior', 'NetCDF', 'wood'],
      position: 2,
    })
  })

  it('keeps normalized concepts unchanged when all are unique and valid', async () => {
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

    renderUseInitPrefs(args)

    await waitFor(() => {
      expect(args.conceptSelection.init).toHaveBeenCalledWith({
        state: ['root', 'dingo', 'object'],
        position: 1,
      })
    })

    expect(args.updatePreferences).not.toHaveBeenCalledWith('concepts', expect.anything())
  })

  it('adjusts concept position when a deleted concept appears before the current position', async () => {
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

    renderUseInitPrefs(args)

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

    renderUseInitPrefs(args, { checkConceptName: createCheckConceptName([]) })

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

  it('falls back to default panel when panel history is empty', async () => {
    const args = createArgs({
      getPreferences: vi.fn(async () => ({
        concepts: {
          state: ['root'],
          position: 0,
        },
        panels: {
          state: [],
          position: -1,
        },
        settings: {},
      })),
    })

    renderUseInitPrefs(args)

    await waitFor(() => {
      expect(args.panelSelection.init).toHaveBeenCalledWith({
        state: ['Concepts'],
        position: 0,
      })
    })

    expect(args.updatePreferences).toHaveBeenCalledWith('panels', {
      state: ['Concepts'],
      position: 0,
    })
  })

  it('falls back to Concepts when panel selection has no default panel', async () => {
    const args = createArgs({
      panelSelection: createSelection({ state: [] }),
      getPreferences: vi.fn(async () => ({
        concepts: {
          state: ['root'],
          position: 0,
        },
        panels: {
          state: [],
          position: -1,
        },
        settings: {},
      })),
    })

    renderUseInitPrefs(args)

    await waitFor(() => {
      expect(args.panelSelection.init).toHaveBeenCalledWith({
        state: ['Concepts'],
        position: 0,
      })
    })

    expect(args.showBoundary).not.toHaveBeenCalled()
    expect(args.updatePreferences).toHaveBeenCalledWith('panels', {
      state: ['Concepts'],
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

    renderUseInitPrefs(args)

    await waitFor(() => {
      expect(args.showBoundary).toHaveBeenCalledWith(initError)
      expect(args.setIsLoading).toHaveBeenCalledWith(false)
    })

    expect(args.setIsLoading).toHaveBeenCalledWith(true)
    expect(args.setPreferencesInitialized).not.toHaveBeenCalled()
  })
})
