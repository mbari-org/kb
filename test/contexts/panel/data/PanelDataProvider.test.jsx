import { use, useState } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from 'react-error-boundary'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import PanelDataProvider from '@/contexts/panel/data/PanelDataProvider'

import { getConceptLinkRealizations, getRealizations } from '@/lib/api/realizations'

const DINGO_REALIZATIONS = [
  { id: 1, concept: 'dingo', linkName: 'eats', toConcept: 'fish', linkValue: 'daily', lastUpdated: null },
]
const WOLF_REALIZATIONS = [
  { id: 2, concept: 'wolf', linkName: 'eats', toConcept: 'fox', linkValue: 'often', lastUpdated: null },
]

const Probe = () => {
  const { getAllRealizations, getConceptRealizations, realizationsAllLoaded } = use(PanelDataContext)
  return (
    <>
      <div data-testid='all-loaded'>{String(realizationsAllLoaded)}</div>
      <div data-testid='dingo'>{JSON.stringify(getConceptRealizations('dingo'))}</div>
      <div data-testid='coyote'>{JSON.stringify(getConceptRealizations('coyote'))}</div>
      <div data-testid='all'>{JSON.stringify(getAllRealizations().map(r => r.id))}</div>
    </>
  )
}

const Actions = () => {
  const {
    loadAllRealizations,
    ensureConceptRealizations,
    invalidateConceptRealizations,
    reloadConceptRealizations,
    renameConceptRealizations,
    renameRealizationToConceptNames,
    setConceptRealizations,
  } = use(PanelDataContext)
  const [ensureResult, setEnsureResult] = useState(null)
  return (
    <>
      <div data-testid='ensure-result'>{JSON.stringify(ensureResult)}</div>
      <button onClick={() => ensureConceptRealizations('dingo')} type='button'>
        ensure-dingo
      </button>
      <button onClick={() => ensureConceptRealizations('wolf')} type='button'>
        ensure-wolf
      </button>
      <button onClick={async () => setEnsureResult(await ensureConceptRealizations('coyote'))} type='button'>
        ensure-coyote
      </button>
      <button onClick={() => loadAllRealizations()} type='button'>
        ensure-all
      </button>
      <button onClick={() => loadAllRealizations({ force: true })} type='button'>
        force-all
      </button>
      <button
        onClick={() => setConceptRealizations('dingo', [{ ...DINGO_REALIZATIONS[0], linkValue: 'weekly' }])}
        type='button'
      >
        set-dingo
      </button>
      <button onClick={() => reloadConceptRealizations('dingo')} type='button'>
        reload-dingo
      </button>
      <button onClick={() => invalidateConceptRealizations('all')} type='button'>
        invalidate-all
      </button>
      <button onClick={() => renameConceptRealizations('dingo', 'coyote')} type='button'>
        rename-concept
      </button>
      <button onClick={() => renameRealizationToConceptNames('fish', 'shark')} type='button'>
        rename-refs
      </button>
    </>
  )
}

const renderProvider = apiFns =>
  render(
    <ErrorBoundary fallbackRender={() => null}>
      <ConfigContext.Provider value={{ apiFns }}>
        <PanelDataProvider>
          <Probe />
          <Actions />
        </PanelDataProvider>
      </ConfigContext.Provider>
    </ErrorBoundary>
  )

describe('PanelDataProvider realizations store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const buildApiFns = () => ({
    apiPaginated: vi.fn(async () => []),
    apiPayload: vi.fn(async (fn, value) => {
      if (fn === getConceptLinkRealizations && value === 'dingo') return DINGO_REALIZATIONS.map(r => ({ ...r }))
      if (fn === getConceptLinkRealizations && value === 'wolf') return WOLF_REALIZATIONS.map(r => ({ ...r }))
      if (fn === getConceptLinkRealizations) return []
      if (fn === getRealizations) return { content: [...DINGO_REALIZATIONS, ...WOLF_REALIZATIONS].map(r => ({ ...r })) }
      return []
    }),
    apiResult: vi.fn(async () => 0),
  })

  it('treats a missing key as not loaded and an empty list as loaded', async () => {
    const apiFns = buildApiFns()
    renderProvider(apiFns)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'ensure-dingo' })).toBeInTheDocument()
    })
    expect(screen.getByTestId('dingo').textContent).toBe('')

    await act(async () => {
      screen.getByRole('button', { name: 'ensure-dingo' }).click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('dingo').textContent).toBe(JSON.stringify(DINGO_REALIZATIONS))
    })
    expect(screen.getByTestId('all-loaded').textContent).toBe('false')
  })

  it('ensureAll fills multiple concept keys and flattens for the all view', async () => {
    const apiFns = buildApiFns()
    renderProvider(apiFns)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'ensure-all' })).toBeInTheDocument()
    })

    await act(async () => {
      screen.getByRole('button', { name: 'ensure-all' }).click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('all-loaded').textContent).toBe('true')
    })
    expect(screen.getByTestId('dingo').textContent).toBe(JSON.stringify(DINGO_REALIZATIONS))
    expect(screen.getByTestId('all').textContent).toBe(JSON.stringify([1, 2]))
  })

  it('setConceptRealizations updates a single key and keeps the all view consistent', async () => {
    const apiFns = buildApiFns()
    renderProvider(apiFns)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'ensure-all' })).toBeInTheDocument()
    })
    await act(async () => {
      screen.getByRole('button', { name: 'ensure-all' }).click()
    })
    await waitFor(() => {
      expect(screen.getByTestId('all-loaded').textContent).toBe('true')
    })

    await act(async () => {
      screen.getByRole('button', { name: 'set-dingo' }).click()
    })

    await waitFor(() => {
      const dingo = JSON.parse(screen.getByTestId('dingo').textContent)
      expect(dingo[0].linkValue).toBe('weekly')
    })
    expect(JSON.parse(screen.getByTestId('all').textContent)).toEqual([1, 2])
  })

  it('shares one in-flight ensure for concurrent concept requests', async () => {
    const apiFns = buildApiFns()
    renderProvider(apiFns)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'ensure-dingo' })).toBeInTheDocument()
    })

    await act(async () => {
      screen.getByRole('button', { name: 'ensure-dingo' }).click()
      screen.getByRole('button', { name: 'ensure-dingo' }).click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('dingo').textContent).toBe(JSON.stringify(DINGO_REALIZATIONS))
    })

    const linkRealizationCalls = apiFns.apiPayload.mock.calls.filter(([fn]) => fn === getConceptLinkRealizations)
    expect(linkRealizationCalls).toHaveLength(1)
  })

  it('reload bypasses the cache and invalidate-all resets the store', async () => {
    const apiFns = buildApiFns()
    renderProvider(apiFns)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'ensure-all' })).toBeInTheDocument()
    })
    await act(async () => {
      screen.getByRole('button', { name: 'ensure-all' }).click()
    })
    await waitFor(() => {
      expect(screen.getByTestId('all-loaded').textContent).toBe('true')
    })

    await act(async () => {
      screen.getByRole('button', { name: 'invalidate-all' }).click()
    })

    expect(screen.getByTestId('all-loaded').textContent).toBe('false')
    expect(screen.getByTestId('dingo').textContent).toBe('')

    await act(async () => {
      screen.getByRole('button', { name: 'reload-dingo' }).click()
    })
    await waitFor(() => {
      expect(screen.getByTestId('dingo').textContent).toBe(JSON.stringify(DINGO_REALIZATIONS))
    })
    expect(screen.getByTestId('all-loaded').textContent).toBe('false')
  })

  it('renameConceptRealizations re-keys and relabels items, and ensure resolves from the relabeled cache without a fetch', async () => {
    const apiFns = buildApiFns()
    renderProvider(apiFns)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'ensure-all' })).toBeInTheDocument()
    })
    await act(async () => {
      screen.getByRole('button', { name: 'ensure-all' }).click()
    })
    await waitFor(() => {
      expect(screen.getByTestId('all-loaded').textContent).toBe('true')
    })

    const callsBefore = apiFns.apiPayload.mock.calls.length
    await act(async () => {
      screen.getByRole('button', { name: 'rename-concept' }).click()
    })

    expect(screen.getByTestId('dingo').textContent).toBe('')
    const coyote = JSON.parse(screen.getByTestId('coyote').textContent)
    expect(coyote).toHaveLength(1)
    expect(coyote[0].concept).toBe('coyote')
    expect(coyote[0].toConcept).toBe('fish')

    await act(async () => {
      screen.getByRole('button', { name: 'ensure-coyote' }).click()
    })
    await waitFor(() => {
      const ensured = JSON.parse(screen.getByTestId('ensure-result').textContent)
      expect(ensured).toHaveLength(1)
      expect(ensured[0].concept).toBe('coyote')
    })
    expect(apiFns.apiPayload.mock.calls.length).toBe(callsBefore)
  })

  it('renameRealizationToConceptNames rewrites toConcept across loaded keys without a fetch', async () => {
    const apiFns = buildApiFns()
    renderProvider(apiFns)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'ensure-all' })).toBeInTheDocument()
    })
    await act(async () => {
      screen.getByRole('button', { name: 'ensure-all' }).click()
    })
    await waitFor(() => {
      expect(screen.getByTestId('all-loaded').textContent).toBe('true')
    })

    const callsBefore = apiFns.apiPayload.mock.calls.length
    await act(async () => {
      screen.getByRole('button', { name: 'rename-refs' }).click()
    })

    const dingo = JSON.parse(screen.getByTestId('dingo').textContent)
    expect(dingo[0].toConcept).toBe('shark')
    expect(apiFns.apiPayload.mock.calls.length).toBe(callsBefore)
  })
})
