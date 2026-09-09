import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'

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
    const updatedTaxonomy = { conceptMap: {}, aliasMap: {} }
    const closestConcept = { name: 'sibling' }

    const closeModal = vi.fn((confirmed, onComplete) => onComplete?.())
    const refreshData = vi.fn(async () => ({}))
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
          <ConceptContext.Provider value={{ concept, pending: () => [] }}>
            <ConceptStagedContext.Provider value={{ confirmReset: null }}>
              <ConceptModalContext.Provider
                value={{ closeModal, setModalData: vi.fn(), withProcessing }}
              >
                <ConceptModalDataContext.Provider
                  value={{ modalData: { alertType: 'delete', isValid: true, reassign: null, relatedDataCounts: [] } }}
                >
                  <PanelDataContext.Provider
                    value={{
                      getReferences: vi.fn(),
                      realizations: [],
                      refreshData,
                      setClearTemplateFilters,
                      templates: [],
                    }}
                  >
                    <PreferencesContext.Provider value={{ savePreferences: vi.fn() }}>
                      <SelectedContext.Provider value={{ updateSelected }}>
                        <SelectedSettingsContext.Provider value={{ settings: {} }}>
                          <TaxonomyContext.Provider value={{ taxonomy: {}, updateTaxonomy }}>
                            <UserContext.Provider value={{ getPreferences: vi.fn() }}>
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

    expect(withProcessing).toHaveBeenCalledWith(
      expect.any(Function),
      PROCESSING.DELETE,
      PROCESSING.ARG.CONCEPT
    )
    expect(deleteTaxonomyConceptMock).toHaveBeenCalled()
    expect(closeModal).toHaveBeenCalledWith(true, expect.any(Function))
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'sibling' })
    expect(setClearTemplateFilters).toHaveBeenCalledWith(true)
  })
})
