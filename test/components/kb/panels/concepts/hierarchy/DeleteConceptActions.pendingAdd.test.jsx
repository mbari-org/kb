import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { ErrorBoundary } from 'react-error-boundary'

import kbTheme from '@/lib/theme'

import DeleteConceptActions from '@/components/kb/panels/concepts/concept/change/staged/name/delete/DeleteConceptActions'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import { deleteConceptById as apiDeleteConceptById } from '@/lib/api/concept'
import { ACTION, HISTORY_FIELD } from '@/lib/constants'
import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG

const applyResultsMock = vi.fn()
const preSideEffectsMock = vi.fn()
const postSideEffectsMock = vi.fn()
const deleteTaxonomyConceptMock = vi.fn()
const processPendingApprovalMock = vi.fn()

vi.mock('@/components/kb/panels/concepts/concept/change/staged/name/delete/deletionSideEffects', () => ({
  applyResults: (...args) => applyResultsMock(...args),
  preSideEffects: (...args) => preSideEffectsMock(...args),
  postSideEffects: (...args) => postSideEffectsMock(...args),
}))

vi.mock('@/lib/model/taxonomy', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    deleteConcept: (...args) => deleteTaxonomyConceptMock(...args),
  }
})

vi.mock('@/lib/concept/pending/processPendingApproval', () => ({
  default: (...args) => processPendingApprovalMock(...args),
}))

const concept = { id: 42, name: 'doomed', parent: 'root', children: [], alternateNames: [] }
const addItem = {
  id: 'add',
  concept: 'root',
  field: HISTORY_FIELD.CHILD,
  action: ACTION.ADD,
  newValue: 'doomed',
  recordedName: 'doomed',
}

const renderDelete = ({ isAdmin, pendingHistory, pendingParent, closeModal, withProcessing, apiWrite }) => {
  const modifyConcept = vi.fn()
  const removeName = vi.fn()
  const setClearTemplateFilters = vi.fn()
  const updateSelected = vi.fn()
  const refreshData = vi.fn(async () => ({}))

  render(
    <ThemeProvider theme={kbTheme}>
      <ConfigContext.Provider value={{ apiFns: { apiPayload: vi.fn(), apiWrite } }}>
        <ConceptContext.Provider
          value={{
            concept,
            initialState: { name: { action: 'None', value: 'doomed' } },
            pending: key => (key === PENDING.DATA.PARENT ? pendingParent : []),
            setEditing: vi.fn(),
          }}
        >
          <ConceptStagedContext.Provider value={{ confirmReset: null, modifyConcept }}>
            <ConceptModalContext.Provider value={{ closeModal, setModalData: vi.fn(), withProcessing }}>
              <ConceptModalDataContext.Provider
                value={{ modalData: { alertType: 'delete', isValid: true, reassign: null, relatedDataCounts: [] } }}
              >
                <PanelDataContext.Provider
                  value={{
                    ensureConceptRealizations: vi.fn(async () => []),
                    getReferences: vi.fn(),
                    invalidateConceptRealizations: vi.fn(),
                    pendingHistory,
                    refreshData,
                    reloadConceptRealizations: vi.fn(async () => []),
                    renameRealizationToConceptNames: vi.fn(),
                    setClearTemplateFilters,
                    templates: [],
                  }}
                >
                  <PreferencesContext.Provider value={{ savePreferences: vi.fn(), updatePreferences: vi.fn() }}>
                    <SelectedContext.Provider value={{ concepts: { removeName }, updateSelected }}>
                      <SelectedSettingsContext.Provider value={{ settings: {} }}>
                        <TaxonomyContext.Provider
                          value={{
                            closestConcept: vi.fn(() => ({ name: 'sibling' })),
                            isDescendant: vi.fn(() => false),
                            taxonomy: {},
                            updateTaxonomy: vi.fn(),
                          }}
                        >
                          <UserContext.Provider value={{ getPreferences: vi.fn(), isAdmin }}>
                            <ErrorBoundary fallback={null}><DeleteConceptActions /></ErrorBoundary>
                          </UserContext.Provider>
                        </TaxonomyContext.Provider>
                      </SelectedSettingsContext.Provider>
                    </SelectedContext.Provider>
                  </PreferencesContext.Provider>
                </PanelDataContext.Provider>
              </ConceptModalDataContext.Provider>
            </ConceptModalContext.Provider>
          </ConceptStagedContext.Provider>
        </ConceptContext.Provider>
      </ConfigContext.Provider>
    </ThemeProvider>
  )

  return { removeName, setClearTemplateFilters, updateSelected }
}

describe('DeleteConceptActions for a pending-add concept', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    preSideEffectsMock.mockResolvedValue({})
    postSideEffectsMock.mockResolvedValue({})
    applyResultsMock.mockResolvedValue({})
    processPendingApprovalMock.mockResolvedValue({
      concepts: {},
      pendingHistory: [],
      removed: ['doomed'],
      updated: [],
    })
  })

  it('rejects the pending Add Child instead of deleting the concept directly, as an admin', async () => {
    const closeModal = vi.fn((confirmed, onComplete) => onComplete?.())
    const withProcessing = vi.fn(async work => work())
    const { setClearTemplateFilters } = renderDelete({
      isAdmin: true,
      pendingHistory: [addItem],
      pendingParent: [addItem],
      closeModal,
      withProcessing,
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.CONFIRM }))

    await waitFor(() => expect(closeModal).toHaveBeenCalledWith(true, expect.any(Function)))
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({ approval: PENDING.APPROVAL.REJECT, items: [addItem] })
    )
    expect(deleteTaxonomyConceptMock).not.toHaveBeenCalled()
    expect(preSideEffectsMock).toHaveBeenCalled()
    expect(postSideEffectsMock).toHaveBeenCalled()
    expect(withProcessing).toHaveBeenCalledWith(expect.any(Function), PROCESSING.DELETE, PROCESSING.ARG.CONCEPT)
    expect(setClearTemplateFilters).toHaveBeenCalledWith(true)
  })

  it('still records a pending delete for a maintainer, leaving the pending add to the approval batch', async () => {
    const apiWrite = vi.fn(async () => ({}))
    const closeModal = vi.fn()
    const withProcessing = vi.fn(async work => work())
    renderDelete({
      isAdmin: false,
      pendingHistory: [addItem],
      pendingParent: [addItem],
      closeModal,
      withProcessing,
      apiWrite,
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.CONFIRM }))

    await waitFor(() => expect(closeModal).toHaveBeenCalledWith(true))
    expect(apiWrite).toHaveBeenCalledWith(apiDeleteConceptById, concept.id)
    expect(processPendingApprovalMock).not.toHaveBeenCalled()
    expect(deleteTaxonomyConceptMock).not.toHaveBeenCalled()
  })
})
