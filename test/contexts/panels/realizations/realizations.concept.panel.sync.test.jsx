import { use, useState } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { ErrorBoundary } from 'react-error-boundary'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'
import UserContext from '@/contexts/user/UserContext'

import useModifyRealizations from '@/contexts/panels/realizations/useModifyRealizations'

import {
  getConcept as apiConcept,
  getConceptChildren as apiChildren,
  getConceptNames as apiConceptNames,
  getConceptParent as apiParent,
  getConceptPath,
} from '@/lib/api/concept'
import { getMedia } from '@/lib/api/media'
import { deleteRealization as apiDeleteRealization, getConceptLinkRealizations, updateRealization } from '@/lib/api/realizations'
import { getNames as apiNames, getRanks as apiRanks, getRoot as apiRoot } from '@/lib/api/taxonomy'

import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { SELECTED } from '@/lib/constants/selected.js'

const ORIGINAL = { id: 7, concept: 'dingo', linkName: 'eats', toConcept: 'fish', linkValue: 'daily' }

const createConceptRecord = ({ alternateNames = [], children, linkRealizations = [], name, parent }) => {
  const concept = {
    alternateNames,
    linkRealizations: linkRealizations.map(r => ({ ...r })),
    media: [],
    name,
    parent,
    realizations: [],
    references: [],
    templates: [],
  }
  if (children !== undefined) {
    concept.children = children
  }
  return concept
}

const createStore = () => ({
  children: { root: ['dingo'], dingo: [] },
  concepts: {
    root: createConceptRecord({ name: 'root', parent: undefined }),
    dingo: createConceptRecord({
      linkRealizations: [{ id: 7, linkName: 'eats', toConcept: 'fish', linkValue: 'daily' }],
      name: 'dingo',
      parent: 'root',
    }),
  },
  ranks: [],
  realizations: [{ ...ORIGINAL }],
  pendingHistory: [],
})

const cloneConcept = concept => ({
  ...concept,
  alternateNames: [...(concept.alternateNames || [])],
  children: concept.children ? [...concept.children] : concept.children,
  linkRealizations: (concept.linkRealizations || []).map(r => ({ ...r })),
})

const createApiFns = (store, { isAdmin }) => ({
  apiPayload: vi.fn(async (fn, value) => {
    if (fn === apiRoot) return { name: 'root' }
    if (fn === apiNames) return Object.keys(store.concepts).sort()
    if (fn === apiRanks) return []
    if (fn === apiConcept) return cloneConcept(store.concepts[value])
    if (fn === apiChildren) return (store.children[value] || []).map(childName => cloneConcept(store.concepts[childName]))
    if (fn === apiConceptNames) return []
    if (fn === apiParent) return { name: store.concepts[value]?.parent }
    if (fn === getConceptPath) return { name: 'root', children: [{ name: 'dingo' }] }
    if (fn === getMedia) return []
    if (fn === getConceptLinkRealizations)
      return store.realizations.filter(r => r.concept === value).map(r => ({ ...r }))
    if (fn === updateRealization) {
      const [id, updates] = value
      if (isAdmin) {
        store.realizations = store.realizations.map(r => (r.id === id ? { ...r, ...updates } : r))
      } else {
        const prior = store.realizations.find(r => r.id === id)
        store.pendingHistory = [
          ...store.pendingHistory,
          {
            id: `pending-${store.pendingHistory.length + 1}`,
            action: ACTION.EDIT,
            concept: prior.concept,
            field: HISTORY_FIELD.REALIZATION,
            oldValue: `${prior.linkName} | ${prior.toConcept} | ${prior.linkValue}`,
            newValue: `${updates.linkName ?? prior.linkName} | ${updates.toConcept ?? prior.toConcept} | ${
              updates.linkValue ?? prior.linkValue
            }`,
          },
        ]
      }
      return {}
    }
    if (fn === apiDeleteRealization) {
      const id = value
      if (isAdmin) {
        store.realizations = store.realizations.filter(r => r.id !== id)
      } else {
        const prior = store.realizations.find(r => r.id === id)
        store.pendingHistory = [
          ...store.pendingHistory,
          {
            id: `pending-${store.pendingHistory.length + 1}`,
            action: ACTION.DELETE,
            concept: prior.concept,
            field: HISTORY_FIELD.REALIZATION,
            newValue: null,
            oldValue: `${prior.linkName} | ${prior.toConcept} | ${prior.linkValue}`,
          },
        ]
      }
      return {}
    }
    throw new Error(`Unexpected api payload function: ${fn?.name || 'unknown'}`)
  }),
})

const ConceptProbe = () => {
  const { stagedState } = use(ConceptStagedContext)
  const realizations = stagedState?.realizations || []
  return (
    <div data-testid='probe'>
      {realizations.map(r => (
        <div key={r.stateId} data-testid='realization'>
          {`${r.linkName} | ${r.toConcept} | ${r.linkValue}${r.action ? ` [${r.action}]` : ''}`}
        </div>
      ))}
    </div>
  )
}

const ModifyBridge = ({ children }) => {
  const modify = useModifyRealizations()
  return children(modify)
}

const PanelDataHarness = ({ store, children }) => {
  const [pendingHistory, setPendingHistory] = useState(() => [...store.pendingHistory])
  const [realizations, setRealizations] = useState(() => [...store.realizations])

  const refreshData = vi.fn(async key => {
    if (key === 'pendingHistory') setPendingHistory([...store.pendingHistory])
    if (key === 'realizations') setRealizations([...store.realizations])
    return { pendingHistory: store.pendingHistory, realizations: store.realizations }
  })

  return (
    <PanelDataContext.Provider
      value={{ getConceptTemplates: vi.fn(() => []), isLoading: false, pendingHistory, realizations, refreshData, templates: [] }}
    >
      {children}
    </PanelDataContext.Provider>
  )
}

const renderApp = ({ isAdmin }) => {
  const store = createStore()
  const apiFns = createApiFns(store, { isAdmin })
  const errors = []

  render(
    <ErrorBoundary fallbackRender={() => null} onError={error => errors.push(error)}>
      <UserContext.Provider value={{ guardedAction: null, isAdmin, setHasUnsavedChanges: vi.fn(), user: {} }}>
        <ConfigContext.Provider value={{ apiFns, phylogenyRoot: 'root' }}>
          <TaxonomyProvider>
            <AppModalContext.Provider value={{ beginProcessing: vi.fn(() => vi.fn()) }}>
              <ConceptModalContext.Provider value={{ setModal: vi.fn(), setModalData: vi.fn() }}>
                <SelectedContext.Provider
                  value={{
                    concepts: { clear: vi.fn(), getState: vi.fn(() => ['dingo']), push: vi.fn() },
                    getSelected: key => (key === SELECTED.CONCEPT ? 'dingo' : null),
                    panels: { current: () => SELECTED.PANELS.CONCEPTS },
                  }}
                >
                  <PanelDataHarness store={store}>
                    <ConceptProvider>
                      <ModifyBridge>
                        {({ deleteRealization, editRealization }) => (
                          <>
                            <button onClick={() => editRealization(ORIGINAL, { linkValue: 'weekly' })} type='button'>
                              edit
                            </button>
                            <button onClick={() => deleteRealization(ORIGINAL)} type='button'>
                              delete
                            </button>
                            <ConceptProbe />
                          </>
                        )}
                      </ModifyBridge>
                    </ConceptProvider>
                  </PanelDataHarness>
                </SelectedContext.Provider>
              </ConceptModalContext.Provider>
            </AppModalContext.Provider>
          </TaxonomyProvider>
        </ConfigContext.Provider>
      </UserContext.Provider>
    </ErrorBoundary>
  )

  return { errors, store }
}

describe('Realizations panel edit reflected on Concept panel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('admin edit updates the Concept panel realization', async () => {
    const { errors } = renderApp({ isAdmin: true })

    await waitFor(() => {
      expect(screen.getByTestId('realization')).toHaveTextContent('eats | fish | daily')
    })

    await act(async () => {
      screen.getByRole('button', { name: 'edit' }).click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('realization')).toHaveTextContent('eats | fish | weekly')
    })
    expect(errors).toEqual([])
  })

  it('non-admin edit shows the change with pending status on the Concept panel', async () => {
    const { errors } = renderApp({ isAdmin: false })

    await waitFor(() => {
      expect(screen.getByTestId('realization')).toHaveTextContent('eats | fish | daily')
    })

    await act(async () => {
      screen.getByRole('button', { name: 'edit' }).click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('realization')).toHaveTextContent('eats | fish | weekly [Edit Pending]')
    })
    expect(errors).toEqual([])
  })

  it('admin delete removes the realization from the Concept panel', async () => {
    const { errors } = renderApp({ isAdmin: true })

    await waitFor(() => {
      expect(screen.getByTestId('realization')).toHaveTextContent('eats | fish | daily')
    })

    await act(async () => {
      screen.getByRole('button', { name: 'delete' }).click()
    })

    await waitFor(() => {
      expect(screen.queryByTestId('realization')).not.toBeInTheDocument()
    })
    expect(errors).toEqual([])
  })

  it('non-admin delete keeps the realization with pending status on the Concept panel', async () => {
    const { errors } = renderApp({ isAdmin: false })

    await waitFor(() => {
      expect(screen.getByTestId('realization')).toHaveTextContent('eats | fish | daily')
    })

    await act(async () => {
      screen.getByRole('button', { name: 'delete' }).click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('realization')).toHaveTextContent('eats | fish | daily [Delete Pending]')
    })
    expect(errors).toEqual([])
  })
})
