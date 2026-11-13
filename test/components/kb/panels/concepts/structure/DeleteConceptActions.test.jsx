import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'

import kbTheme from '@/lib/theme'

import DeleteConceptActions from '@/components/kb/panels/concepts/concept/change/staged/name/delete/DeleteConceptActions'
import ConceptEditingActions from '@/components/kb/panels/concepts/concept/ConceptEditingActions'
import useConceptPending from '@/contexts/panels/concepts/pending/useConceptPending'

import { deleteConcept as apiDeleteConcept } from '@/lib/api/concept'
import { ACTION, HISTORY_FIELD } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { PANEL_DATA } from '@/lib/constants/panelData.js'

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

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG

const applyResultsMock = vi.fn()
const preSideEffectsMock = vi.fn()
const postSideEffectsMock = vi.fn()
const deleteTaxonomyConceptMock = vi.fn()
const getTaxonomyConceptMock = vi.fn()
const insertConceptMock = vi.fn()
const normalizeConceptMock = vi.fn()

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
    getConcept: (...args) => getTaxonomyConceptMock(...args),
    insertConcept: (...args) => insertConceptMock(...args),
  }
})

vi.mock('@/lib/api/concept', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    normalizeConcept: (...args) => normalizeConceptMock(...args),
  }
})

describe('DeleteConceptActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('runs the delete flow through withProcessing when Confirm is clicked', async () => {
    const concept = { name: 'doomed', parent: 'root' }
    const initialState = { name: { action: 'None', value: 'doomed' } }
    const modifyConcept = vi.fn()
    const updatedTaxonomy = { conceptMap: {}, aliasMap: {} }
    const closestConcept = { name: 'sibling' }

    const closeModal = vi.fn((confirmed, onComplete) => onComplete?.())
    const refreshData = vi.fn(async () => ({}))
    const removeName = vi.fn()
    const setClearTemplateFilters = vi.fn()
    const updateSelected = vi.fn()
    const updateTaxonomy = vi.fn()
    const withProcessing = vi.fn(async work => work())

    preSideEffectsMock.mockImplementation(async () => ({}))
    postSideEffectsMock.mockImplementation(async () => ({}))
    deleteTaxonomyConceptMock.mockImplementation(async () => ({
      closestConcept,
      taxonomy: updatedTaxonomy,
    }))
    getTaxonomyConceptMock.mockImplementation(() => ({ name: 'sibling' }))
    normalizeConceptMock.mockImplementation(async () => ({}))
    applyResultsMock.mockImplementation(async () => ({}))

    render(
      <ThemeProvider theme={kbTheme}>
        <ConfigContext.Provider value={{ apiFns: { apiPayload: vi.fn() } }}>
          <ConceptContext.Provider value={{ concept, initialState, pending: () => [] }}>
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
                      refreshData,
                      renameRealizationToConceptNames: vi.fn(),
                      setClearTemplateFilters,
                      templates: [],
                    }}
                  >
                    <PreferencesContext.Provider value={{ savePreferences: vi.fn() }}>
                      <SelectedContext.Provider value={{ concepts: { removeName }, updateSelected }}>
                        <SelectedSettingsContext.Provider value={{ settings: {} }}>
                          <TaxonomyContext.Provider value={{ taxonomy: {}, updateTaxonomy }}>
                            <UserContext.Provider value={{ getPreferences: vi.fn(), isAdmin: true }}>
                              <DeleteConceptActions />
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

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.CONFIRM }))

    await waitFor(() => {
      expect(updateTaxonomy).toHaveBeenCalledWith(updatedTaxonomy)
    })

    expect(withProcessing).toHaveBeenCalledWith(expect.any(Function), PROCESSING.DELETE, PROCESSING.ARG.CONCEPT)
    expect(deleteTaxonomyConceptMock).toHaveBeenCalled()
    expect(modifyConcept).toHaveBeenCalledWith({ type: CONCEPT_STATE.INITIAL, update: { ...initialState } })
    expect(closeModal).toHaveBeenCalledWith(true, expect.any(Function))
    expect(removeName).toHaveBeenCalledWith('doomed')
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'sibling' })
    expect(setClearTemplateFilters).toHaveBeenCalledWith(true)
  })

  it('leaves the concept in the taxonomy and refreshes pending history for a non-admin delete', async () => {
    const concept = { name: 'doomed', parent: 'root' }
    const pendingDeletion = {
      concept: 'root',
      field: HISTORY_FIELD.CHILD,
      action: ACTION.DELETE,
      oldValue: concept.name,
    }

    const apiPayload = vi.fn(async () => ({}))
    const closeModal = vi.fn()
    const refreshData = vi.fn(async () => ({}))
    const setModal = vi.fn()
    const updateSelected = vi.fn()
    const updateTaxonomy = vi.fn()
    const withProcessing = vi.fn(async work => work())

    const EditingState = () => {
      const [isEditing, setEditing] = useState(true)
      const { pending, setPendingConfirm } = useConceptPending(concept)

      return (
        <ConceptContext.Provider value={{ concept, initialState: null, isEditing, pending, setEditing, setPendingConfirm }}>
          <ConceptStagedContext.Provider value={{ confirmReset: null, modifyConcept: vi.fn() }}>
            <div data-testid='editing-actions'>
              <ConceptEditingActions />
            </div>
            <DeleteConceptActions />
          </ConceptStagedContext.Provider>
        </ConceptContext.Provider>
      )
    }

    const PanelState = () => {
      const [pendingHistory, setPendingHistory] = useState([])
      const refreshPanelData = async key => {
        await refreshData(key)
        setPendingHistory([pendingDeletion])
      }

      return (
        <PanelDataContext.Provider
          value={{
            ensureConceptRealizations: vi.fn(async () => []),
            getReferences: vi.fn(),
            invalidateConceptRealizations: vi.fn(),
            pendingHistory,
            refreshData: refreshPanelData,
            renameRealizationToConceptNames: vi.fn(),
            setClearTemplateFilters: vi.fn(),
            templates: [],
          }}
        >
          <EditingState />
        </PanelDataContext.Provider>
      )
    }

    render(
      <ThemeProvider theme={kbTheme}>
        <ConfigContext.Provider value={{ apiFns: { apiPayload } }}>
          <ConceptModalContext.Provider value={{ closeModal, setModal, setModalData: vi.fn(), withProcessing }}>
            <ConceptModalDataContext.Provider
              value={{ modalData: { alertType: 'delete', isValid: true, reassign: null, relatedDataCounts: [] } }}
            >
              <PreferencesContext.Provider value={{ savePreferences: vi.fn() }}>
                <SelectedContext.Provider value={{ concepts: { removeName: vi.fn() }, updateSelected }}>
                  <SelectedSettingsContext.Provider value={{ settings: {} }}>
                    <TaxonomyContext.Provider value={{ taxonomy: {}, updateTaxonomy }}>
                      <UserContext.Provider value={{ getPreferences: vi.fn(), isAdmin: false, isReadOnly: false }}>
                        <PanelState />
                      </UserContext.Provider>
                    </TaxonomyContext.Provider>
                  </SelectedSettingsContext.Provider>
                </SelectedContext.Provider>
              </PreferencesContext.Provider>
            </ConceptModalDataContext.Provider>
          </ConceptModalContext.Provider>
        </ConfigContext.Provider>
      </ThemeProvider>
    )

    const user = userEvent.setup()
    const editingActions = within(screen.getByTestId('editing-actions'))
    expect(editingActions.getByRole('button', { name: CONFIG.BUTTON.CANCEL })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: CONFIG.BUTTON.CONFIRM }))

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalledWith(true)
    })
    const pendingButton = await editingActions.findByRole('button', { name: CONFIG.BUTTON.PENDING })
    expect(editingActions.getAllByRole('button')).toEqual([pendingButton])
    expect(pendingButton).toBeEnabled()
    expect(editingActions.queryByRole('button', { name: CONFIG.BUTTON.EDIT })).not.toBeInTheDocument()
    expect(editingActions.queryByRole('button', { name: CONFIG.BUTTON.SAVE })).not.toBeInTheDocument()
    expect(editingActions.queryByRole('button', { name: CONFIG.BUTTON.CANCEL })).not.toBeInTheDocument()
    await user.click(pendingButton)
    expect(setModal).toHaveBeenCalled()

    expect(apiPayload).toHaveBeenCalledWith(apiDeleteConcept, 'doomed')
    expect(refreshData).toHaveBeenCalledWith(PANEL_DATA.PENDING_HISTORY)
    expect(deleteTaxonomyConceptMock).not.toHaveBeenCalled()
    expect(updateTaxonomy).not.toHaveBeenCalled()
    expect(updateSelected).not.toHaveBeenCalled()
  })
})
