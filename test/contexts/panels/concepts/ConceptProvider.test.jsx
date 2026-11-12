import { use } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'
import { SELECTED } from '@/lib/constants/selected.js'
import { getConceptPhylogenyUp } from '@/lib/api/concept'

const { showBoundaryMock } = vi.hoisted(() => ({
  showBoundaryMock: vi.fn(),
}))

vi.mock('react-error-boundary', () => ({
  useErrorBoundary: () => ({
    showBoundary: showBoundaryMock,
  }),
}))

const concept = {
  aliases: [],
  alternateNames: [],
  children: [],
  media: [],
  name: 'dingo',
  parent: 'root',
  rankLevel: '',
  rankName: '',
  realizations: [],
  references: [],
  templates: [],
}

const ConceptProbe = () => {
  const value = use(ConceptContext)
  return <div data-testid='concept-name'>{value.concept?.name || ''}</div>
}

const RenameProbe = ({ selectedRef }) => {
  const { concept, conceptPath, relabelConceptPaths, setConcept } = use(ConceptContext)
  return (
    <>
      <div data-testid='concept-name'>{concept?.name || ''}</div>
      <div data-testid='concept-path'>{JSON.stringify(conceptPath)}</div>
      <button
        onClick={async () => {
          relabelConceptPaths('dingo', 'coyote')
          selectedRef.current = 'coyote'
          await setConcept({ ...concept, name: 'coyote' })
        }}
        type='button'
      >
        rename
      </button>
    </>
  )
}

const firstConcept = { ...concept, name: 'first' }
const secondConcept = { ...concept, name: 'second' }

const SerializeProbe = ({ selectedRef }) => {
  const { concept: current, setConcept } = use(ConceptContext)
  return (
    <>
      <div data-testid='concept-name'>{current?.name || ''}</div>
      <button
        onClick={() => {
          selectedRef.current = 'second'
          setConcept(firstConcept)
          setConcept(secondConcept)
        }}
        type='button'
      >
        switch
      </button>
    </>
  )
}

const renderProvider = ({ apiPayload, probe, selectedName = 'dingo', selectedRef, taxonomyValue }) => {
  const selectionRef = selectedRef || { current: selectedName }
  const beginProcessing = vi.fn(() => vi.fn())
  const ensureConceptRealizations = vi.fn(async () => [])
  const getConceptTemplates = vi.fn(() => [])
  const setHasUnsavedChanges = vi.fn()
  const updateSelected = vi.fn()

  const defaultTaxonomyValue = {
    getConcept: name => (name === 'dingo' ? concept : null),
    getConceptPath: () => null,
    getConceptPrimaryName: name => (name === 'dingo' ? 'dingo' : undefined),
    isConceptLoaded: name => name === 'dingo',
    loadConcept: vi.fn(async () => concept),
    taxonomy: { rootName: 'root' },
  }

  render(
    <AppModalContext.Provider value={{ beginProcessing }}>
      <ConfigContext.Provider value={{ apiFns: { apiPayload }, phylogenyRoot: 'root' }}>
        <ConceptModalContext.Provider value={{ setModal: vi.fn(), setModalData: vi.fn() }}>
          <PanelDataContext.Provider
            value={{
              ensureConceptRealizations,
              getConceptTemplates,
              pendingHistory: [],
              realizationsByConcept: {},
            }}
          >
            <SelectedContext.Provider
              value={{
                concepts: { clear: vi.fn(), getState: vi.fn(() => [selectionRef.current]), push: vi.fn() },
                getSelected: key => (key === SELECTED.CONCEPT ? selectionRef.current : null),
                panels: { current: () => SELECTED.PANELS.CONCEPTS },
                updateSelected,
              }}
            >
              <TaxonomyContext.Provider value={taxonomyValue || defaultTaxonomyValue}>
                <UserContext.Provider value={{ guardedAction: null, setHasUnsavedChanges }}>
                  <ConceptProvider>{probe || <ConceptProbe />}</ConceptProvider>
                </UserContext.Provider>
              </TaxonomyContext.Provider>
            </SelectedContext.Provider>
          </PanelDataContext.Provider>
        </ConceptModalContext.Provider>
      </ConfigContext.Provider>
    </AppModalContext.Provider>
  )

  return { beginProcessing, ensureConceptRealizations, selectedRef: selectionRef, updateSelected }
}

const phylogenyUpPayload = { name: 'root', children: [{ name: 'dingo' }] }

describe('ConceptProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('routes concept-path fetch failures to the error boundary', async () => {
    const pathError = new Error('concept path failed')
    const apiPayload = vi.fn(async (fn, conceptName) => {
      if (fn === getConceptPhylogenyUp && conceptName === 'dingo') {
        throw pathError
      }
      return {}
    })

    renderProvider({ apiPayload })

    await waitFor(() => {
      expect(showBoundaryMock).toHaveBeenCalledWith(pathError)
    })
  })

  it('applies the relabeled path after a rename without refetching phylogeny', async () => {
    const apiPayload = vi.fn(async (fn, conceptName) => {
      if (fn === getConceptPhylogenyUp) return phylogenyUpPayload
      throw new Error(`Unexpected api call: ${fn?.name || 'unknown'} ${conceptName || ''}`)
    })
    const selectedRef = { current: 'dingo' }

    renderProvider({ apiPayload, probe: <RenameProbe selectedRef={selectedRef} />, selectedRef })

    await waitFor(() => {
      expect(screen.getByTestId('concept-path').textContent).toBe(JSON.stringify(['root', 'dingo']))
    })
    const pathCallsBefore = apiPayload.mock.calls.filter(([fn]) => fn === getConceptPhylogenyUp)
    expect(pathCallsBefore).toHaveLength(1)

    await act(async () => {
      screen.getByRole('button', { name: 'rename' }).click()
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await waitFor(() => {
      expect(screen.getByTestId('concept-name').textContent).toBe('coyote')
    })
    await waitFor(() => {
      expect(screen.getByTestId('concept-path').textContent).toBe(JSON.stringify(['root', 'coyote']))
    })

    const pathCalls = apiPayload.mock.calls.filter(([fn]) => fn === getConceptPhylogenyUp)
    expect(pathCalls).toHaveLength(1)
    expect(pathCalls[0][1]).toBe('dingo')
  })

  it('uses the taxonomy-derived concept path without fetching phylogeny', async () => {
    const apiPayload = vi.fn(async fn => {
      throw new Error(`Unexpected api call: ${fn?.name || 'unknown'}`)
    })
    const taxonomyValue = {
      getConcept: name => (name === 'dingo' ? concept : null),
      getConceptPath: name => (name === 'dingo' ? ['root', 'dingo'] : null),
      getConceptPrimaryName: name => (name === 'dingo' ? 'dingo' : undefined),
      isConceptLoaded: name => name === 'dingo',
      loadConcept: vi.fn(async () => concept),
      taxonomy: { rootName: 'root' },
    }

    renderProvider({ apiPayload, probe: <RenameProbe selectedRef={{ current: 'dingo' }} />, taxonomyValue })

    await waitFor(() => {
      expect(screen.getByTestId('concept-path').textContent).toBe(JSON.stringify(['root', 'dingo']))
    })
    expect(apiPayload).not.toHaveBeenCalled()
  })

  it('serializes rapid setConcept calls instead of dropping them', async () => {
    const apiPayload = vi.fn(async fn => {
      throw new Error(`Unexpected api call: ${fn?.name || 'unknown'}`)
    })
    const conceptsByName = { dingo: concept, first: firstConcept, second: secondConcept }
    const taxonomyValue = {
      getConcept: name => conceptsByName[name] || null,
      getConceptPath: name => (conceptsByName[name] ? ['root', name] : null),
      getConceptPrimaryName: name => (conceptsByName[name] ? name : undefined),
      isConceptLoaded: name => Boolean(conceptsByName[name]),
      loadConcept: vi.fn(async name => conceptsByName[name]),
      taxonomy: { rootName: 'root' },
    }
    const selectedRef = { current: 'dingo' }

    renderProvider({ apiPayload, probe: <SerializeProbe selectedRef={selectedRef} />, selectedRef, taxonomyValue })

    await waitFor(() => {
      expect(screen.getByTestId('concept-name').textContent).toBe('dingo')
    })

    await act(async () => {
      screen.getByRole('button', { name: 'switch' }).click()
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    await waitFor(() => {
      expect(screen.getByTestId('concept-name').textContent).toBe('second')
    })
  })

  it('converges an alias selection to the primary name after the concept loads', async () => {
    const aliasedConcept = { ...concept, alternateNames: ['doggo'] }
    let aliasRegistered = false

    const getConcept = name => {
      if (name === 'dingo') return aliasedConcept
      if (name === 'doggo' && aliasRegistered) return aliasedConcept
      return null
    }

    const taxonomyValue = {
      getConcept,
      getConceptPath: () => null,
      getConceptPrimaryName: name => getConcept(name)?.name,
      isConceptLoaded: name => aliasRegistered && Boolean(getConcept(name)),
      loadConcept: vi.fn(async () => {
        aliasRegistered = true
        return aliasedConcept
      }),
      taxonomy: { rootName: 'root' },
    }

    const apiPayload = vi.fn(async () => phylogenyUpPayload)

    const { ensureConceptRealizations, updateSelected } = renderProvider({
      apiPayload,
      selectedName: 'doggo',
      taxonomyValue,
    })

    await waitFor(() => {
      expect(updateSelected).toHaveBeenCalledWith({ concept: 'dingo' })
    })

    expect(updateSelected).not.toHaveBeenCalledWith({ concept: 'doggo' })
    expect(ensureConceptRealizations).toHaveBeenCalledTimes(1)
  })
})
