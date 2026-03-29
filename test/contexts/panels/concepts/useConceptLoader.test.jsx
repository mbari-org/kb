import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import useConceptLoader from '@/contexts/panels/concepts/useConceptLoader'

const createArgs = overrides => ({
  getConcept: vi.fn(() => ({ name: 'dingo' })),
  getSelected: vi.fn(() => 'dingo'),
  handleLoadConceptError: vi.fn(),
  handleSetConcept: vi.fn(),
  isConceptLoaded: vi.fn(() => false),
  loadConcept: vi.fn(async () => ({ name: 'dingo' })),
  setEditing: vi.fn(),
  ...overrides,
})

describe('useConceptLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('forwards generic load errors for the currently selected concept', async () => {
    const loadError = new Error('boom')
    const args = createArgs({
      loadConcept: vi.fn(async () => {
        throw loadError
      }),
    })

    const { result } = renderHook(() => useConceptLoader(args))

    await act(async () => {
      await result.current('dingo')
    })

    expect(args.setEditing).toHaveBeenCalledWith(false)
    expect(args.handleSetConcept).not.toHaveBeenCalled()
    expect(args.handleLoadConceptError).toHaveBeenCalledWith({
      conceptName: 'dingo',
      message: 'boom',
      original: loadError,
    })
  })

  it('does not surface load errors when the selected concept has changed', async () => {
    const args = createArgs({
      getSelected: vi.fn(() => 'object'),
      loadConcept: vi.fn(async () => {
        throw new Error('boom')
      }),
    })

    const { result } = renderHook(() => useConceptLoader(args))

    await act(async () => {
      await result.current('dingo')
    })

    expect(args.handleLoadConceptError).not.toHaveBeenCalled()
    expect(args.handleSetConcept).not.toHaveBeenCalled()
  })

  it('treats an empty concept load result as a load failure', async () => {
    const args = createArgs({
      loadConcept: vi.fn(async () => null),
    })

    const { result } = renderHook(() => useConceptLoader(args))

    await act(async () => {
      await result.current('dingo')
    })

    expect(args.handleSetConcept).not.toHaveBeenCalled()
    expect(args.handleLoadConceptError).toHaveBeenCalledWith({
      conceptName: 'dingo',
      message: 'Failed to load concept: dingo',
      original: expect.any(Error),
    })
  })

  it('surfaces loaded-state inconsistencies when concept lookup is missing', async () => {
    const args = createArgs({
      getConcept: vi.fn(() => null),
      isConceptLoaded: vi.fn(() => true),
    })

    const { result } = renderHook(() => useConceptLoader(args))

    await act(async () => {
      await result.current('dingo')
    })

    expect(args.loadConcept).not.toHaveBeenCalled()
    expect(args.handleSetConcept).not.toHaveBeenCalled()
    expect(args.handleLoadConceptError).toHaveBeenCalledWith({
      conceptName: 'dingo',
      message: 'Concept marked loaded but lookup failed: dingo',
      original: expect.any(Error),
    })
  })
})
