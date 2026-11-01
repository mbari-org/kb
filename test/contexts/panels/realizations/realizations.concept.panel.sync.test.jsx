import { use } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { ErrorBoundary } from 'react-error-boundary'

import AppModalContext from '@/contexts/app/AppModalContext'
import ConceptProvider from '@/contexts/panels/concepts/ConceptProvider'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataProvider from '@/contexts/panel/data/PanelDataProvider'
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
import { getHistory, getHistoryCount } from '@/lib/api/history'
import { getMedia } from '@/lib/api/media'
import { deleteRealization as apiDeleteRealization, getConceptLinkRealizations, updateRealization } from '@/lib/api/realizations'
import { getTemplatesCount } from '@/lib/api/templates'
import { getNames as apiNames, getRanks as apiRanks, getRoot as apiRoot } from '@/lib/api/taxonomy'

import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { SELECTED } from '@/lib/constants/selected.js'

const ORIGINAL = { id: 7, concept: 'dingo', linkName: 'eats', toConcept: 'fish', linkValue: 'daily' }

const createConceptRecord = ({ alternateNames = [], children, name, parent }) => {
  const concept = { alternateNames, media: [], name, parent, references: [], templates: [] }
  if (children !== undefined) {
    concept.children = children
  }
  return concept
}

const createStore = () => ({
  children: { root: ['dingo'], dingo: [] },
  concepts: {
    root: createConceptRecord({ name: 'root', parent: undefined }),
    dingo: createConceptRecord({ name: 'dingo', parent: 'root' }),
  },
  ranks: [],
  realizations: [{ ...ORIGINAL }],
  pendingHistory: [],
})

const cloneConcept = concept => ({
  ...concept,
  alternateNames: [...(concept.alternateNames || [])],
  children: concept.children ? [...concept.children] : concept.children,
})

const asRealizationString = realization =>
  `${realization.linkName} | ${realization.toConcept} | ${realization.linkValue}`

const createApiFns = (store, { isAdmin }) => ({
  apiPaginated: vi.fn(async fn => {
    if (fn === getHistory) return store.pendingHistory.map(item => ({ ...item }))
    return []
  }),
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
      const prior = store.realizations.find(r => r.id === id)
      store.realizations = store.realizations.map(r => (r.id === id ? { ...r, ...updates } : r))
      if (!isAdmin) {
        store.pendingHistory = [
          ...store.pendingHistory,
          {
            id: `pending-${store.pendingHistory.length + 1}`,
            action: ACTION.EDIT,
            concept: prior.concept,
            field: HISTORY_FIELD.REALIZATION,
            oldValue: asRealizationString(prior),
            newValue: asRealizationString({ ...prior, ...updates }),
          },
        ]
      }
      return {}
    }
    if (fn === apiDeleteRealization) {
      const id = value
      const prior = store.realizations.find(r => r.id === id)
      if (isAdmin) {
        store.realizations = store.realizations.filter(r => r.id !== id)
      } else {
        store.pendingHistory = [
          ...store.pendingHistory,
          {
            id: `pending-${store.pendingHistory.length + 1}`,
            action: ACTION.DELETE,
            concept: prior.concept,
            field: HISTORY_FIELD.REALIZATION,
            newValue: null,
            oldValue: asRealizationString(prior),
          },
        ]
      }
      return {}
    }
    throw new Error(`Unexpected api payload function: ${fn?.name || 'unknown'}`)
  }),
  apiResult: vi.fn(async fn => {
    if (fn === getHistoryCount) return store.pendingHistory.length
    if (fn === getTemplatesCount) return 0
    return 0
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

const renderApp = ({ isAdmin }) => {
  const store = createStore()
  const apiFns = createApiFns(store, { isAdmin })
  const errors = []

  render(
    <ErrorBoundary fallbackRender={() => null} onError={error => errors.push(error)}>
      <UserContext.Provider value={{ guardedAction: null, isAdmin, setHasUnsavedChanges: vi.fn(), user: {} }}>
        <ConfigContext.Provider value={{ apiFns, phylogenyRoot: 'root' }}>
          <TaxonomyProvider>
            <PanelDataProvider>
              <AppModalContext.Provider value={{ beginProcessing: vi.fn(() => vi.fn()) }}>
                <ConceptModalContext.Provider value={{ setModal: vi.fn(), setModalData: vi.fn() }}>
                  <SelectedContext.Provider
                    value={{
                      concepts: { clear: vi.fn(), getState: vi.fn(() => ['dingo']), push: vi.fn() },
                      getSelected: key => (key === SELECTED.CONCEPT ? 'dingo' : null),
                      panels: { current: () => SELECTED.PANELS.CONCEPTS },
                    }}
                  >
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
                  </SelectedContext.Provider>
                </ConceptModalContext.Provider>
              </AppModalContext.Provider>
            </PanelDataProvider>
          </TaxonomyProvider>
        </ConfigContext.Provider>
      </UserContext.Provider>
    </ErrorBoundary>
  )

  return { errors, store }
}

describe('Realizations panel writes reflected on Concept panel', () => {
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
