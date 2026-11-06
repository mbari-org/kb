import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from 'react-error-boundary'

import useAddRealizationButton from '@/components/kb/panels/realizations/form/useAddRealizationButton'
import useModifyRealizations from '@/contexts/panels/realizations/useModifyRealizations'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import TaxonomyProvider from '@/contexts/taxonomy/TaxonomyProvider'
import UserContext from '@/contexts/user/UserContext'
import { PanelModalProvider } from '@/contexts/panel/modal'
import {
  RealizationsModalProvider,
  useRealizationsModalOperationsContext,
} from '@/contexts/panels/realizations/modal'

import {
  getConcept as apiConcept,
  getConceptChildren as apiChildren,
  getConceptNames as apiConceptNames,
  getConceptParent as apiParent,
} from '@/lib/api/concept'
import { getMedia } from '@/lib/api/media'
import { createRealization, getConceptLinkRealizations } from '@/lib/api/realizations'
import { getNames as apiNames, getRanks as apiRanks, getRoot as apiRoot } from '@/lib/api/taxonomy'

const TEMPLATE = { id: 't1', concept: 'old-parent', linkName: 'eats', toConcept: 'nil', linkValue: 'fish' }

const createConceptRecord = ({ alternateNames = [], children, name, parent }) => {
  const concept = { alternateNames, media: [], name, parent, realizations: [], references: [], templates: [] }
  if (children !== undefined) {
    concept.children = children
  }
  return concept
}

const createStore = () => ({
  children: {
    root: ['old-parent'],
    'old-parent': ['moving-child'],
    'moving-child': ['target-child'],
    'target-child': [],
  },
  concepts: {
    root: createConceptRecord({ name: 'root', parent: undefined }),
    'old-parent': createConceptRecord({ name: 'old-parent', parent: 'root' }),
    'moving-child': createConceptRecord({ name: 'moving-child', parent: 'old-parent' }),
    'target-child': createConceptRecord({ name: 'target-child', parent: 'moving-child' }),
  },
  ranks: [],
})

const cloneConcept = concept => ({
  ...concept,
  alternateNames: [...(concept.alternateNames || [])],
  children: concept.children ? [...concept.children] : concept.children,
})

const createApiFns = store => ({
  apiPayload: vi.fn(async (fn, value) => {
    if (fn === apiRoot) return { name: 'root' }
    if (fn === apiNames) return Object.keys(store.concepts).sort()
    if (fn === apiRanks) return []
    if (fn === apiConcept) return cloneConcept(store.concepts[value])
    if (fn === apiChildren) return (store.children[value] || []).map(childName => cloneConcept(store.concepts[childName]))
    if (fn === apiConceptNames) return []
    if (fn === apiParent) return { name: store.concepts[value]?.parent }
    if (fn === getMedia) return []
    if (fn === getConceptLinkRealizations) return []
    if (fn === createRealization) return {}
    throw new Error(`Unexpected api payload function: ${fn?.name || 'unknown'}`)
  }),
})

const ModifyBridge = ({ children }) => {
  const modify = useModifyRealizations()
  return children(modify)
}

const Harness = () => {
  const AddRealizationButton = useAddRealizationButton()
  const { modal, processing } = useRealizationsModalOperationsContext()

  return (
    <>
      {AddRealizationButton()}
      {!processing && modal && modal()}
    </>
  )
}

describe('Realizations panel add save', () => {
  let apiFns
  let errors
  let refreshData
  let reloadConceptRealizations

  beforeEach(() => {
    vi.clearAllMocks()
    errors = []
    apiFns = createApiFns(createStore())
    refreshData = vi.fn(async () => ({}))
    reloadConceptRealizations = vi.fn(async () => [])
  })

  const renderPanel = () =>
    render(
      <ErrorBoundary fallbackRender={() => null} onError={error => errors.push(error)}>
        <UserContext.Provider value={{ isAdmin: true, user: { role: 'Admin' } }}>
          <ConfigContext.Provider value={{ apiFns }}>
            <TaxonomyProvider>
              <PanelModalProvider>
                <PanelDataContext.Provider
                  value={{
                    getConceptRealizations: vi.fn(() => []),
                    isLoading: false,
                    pendingHistory: [],
                    refreshData,
                    reloadConceptRealizations,
                    templates: [TEMPLATE],
                  }}
                >
                  <ConceptContext.Provider value={{ concept: null }}>
                    <ModifyBridge>
                      {({ addRealization }) => (
                        <RealizationsContext.Provider
                          value={{ addRealization, filters: { concept: 'target-child' } }}
                        >
                          <RealizationsModalProvider>
                            <Harness />
                          </RealizationsModalProvider>
                        </RealizationsContext.Provider>
                      )}
                    </ModifyBridge>
                  </ConceptContext.Provider>
                </PanelDataContext.Provider>
              </PanelModalProvider>
            </TaxonomyProvider>
          </ConfigContext.Provider>
        </UserContext.Provider>
      </ErrorBoundary>
    )

  it('creates the realization from a template selection and dismisses the modal', async () => {
    const user = userEvent.setup()
    renderPanel()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(screen.getByText('Concept: target-child')).toBeInTheDocument()
    })

    await user.click(await screen.findByRole('button', { name: 'eats' }))

    await user.click(screen.getByRole('button', { name: 'Save' }))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.queryByText('Concept: target-child')).not.toBeInTheDocument()
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(createRealization, {
      concept: 'target-child',
      linkName: 'eats',
      toConcept: 'nil',
      linkValue: 'fish',
    })
    expect(errors).toEqual([])
  })
})
