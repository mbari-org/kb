import { render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import ToConceptSelectAuxiliary from '@/components/common/concept/ToConceptSelectAuxiliary'
import RealizationForm from '@/components/kb/panels/concepts/concept/change/staged/realizations/edit/form/RealizationForm'
import { ConceptRealizationModalContent } from '@/components/kb/panels/concepts/concept/detail/realizations/ConceptRealizationModalComponents'
import { createDeleteRealizationContent } from '@/components/kb/panels/realizations/form/realizationModalUtils'
import useRealizationColumns from '@/components/kb/panels/realizations/table/data/useRealizationColumns'
import useRealizationsExport from '@/components/kb/panels/realizations/table/header/useRealizationsExport'
import LinkNameInput from '@/components/kb/panels/templates/form/LinkNameInput'
import LinkValueInput from '@/components/kb/panels/templates/form/LinkValueInput'
import { createDeleteTemplateContent } from '@/components/kb/panels/templates/form/templateModalUtils'
import useTemplateColumns from '@/components/kb/panels/templates/table/data/useTemplateColumns'
import useTemplatesExport from '@/components/kb/panels/templates/table/header/useTemplatesExport'
import AppModalContext from '@/contexts/app/AppModalContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'
import CONFIG from '@/lib/config'
import csvExport from '@/lib/csvExport'
import useFilterTooltip from '@/lib/hooks/useFilterTooltip'

vi.mock('@/config/link.json', () => ({
  default: { FIELDS: { LINK_NAME: 'Configured name', LINK_VALUE: 'Configured value', TO_CONCEPT: 'Configured target' } },
}))

vi.mock('@/components/kb/panels/concepts/concept/change/staged/realizations/edit/useAvailableLinkTemplates', () => ({
  default: () => () => [{ linkName: 'eats' }],
}))
vi.mock('@/lib/hooks/useConceptHasPendingDelete', () => ({ default: () => false }))
vi.mock('@/components/kb/panels/history/pending/usePendingItemModal', () => ({ default: () => vi.fn() }))
vi.mock('@/lib/csvExport', () => ({ default: vi.fn(() => vi.fn()) }))

const realization = { concept: 'dingo', linkName: 'eats', linkValue: 'fish', toConcept: 'nil' }
const { FIELDS } = CONFIG.LINK

describe('shared link field labels', () => {
  it('uses configured labels in the realization form', () => {
    render(
      <ConfigContext.Provider value={{ apiFns: null }}>
        <TaxonomyContext.Provider value={{ getNames: () => [] }}>
          <RealizationForm conceptName='dingo' onRealizationChange={vi.fn()} realizationItem={realization} />
        </TaxonomyContext.Provider>
      </ConfigContext.Provider>
    )

    expect(screen.getByLabelText(FIELDS.LINK_NAME)).toBeInTheDocument()
    expect(screen.getByLabelText(FIELDS.TO_CONCEPT)).toBeInTheDocument()
    expect(screen.getByLabelText(FIELDS.LINK_VALUE, { exact: false })).toBeInTheDocument()
  })

  it('uses configured labels for template inputs', () => {
    const { rerender } = render(<LinkNameInput linkNameOptions={null} onChange={vi.fn()} value='' />)
    expect(screen.getByLabelText(FIELDS.LINK_NAME, { exact: false })).toBeInTheDocument()
    rerender(<LinkNameInput linkNameOptions={['eats']} onChange={vi.fn()} value='' />)
    expect(screen.getByLabelText(FIELDS.LINK_NAME, { exact: false })).toBeInTheDocument()
    rerender(<LinkValueInput onChange={vi.fn()} value='' />)
    expect(screen.getByLabelText(FIELDS.LINK_VALUE, { exact: false })).toBeInTheDocument()
  })

  it('uses the target label in the concept selector', () => {
    render(<ToConceptSelectAuxiliary onChange={vi.fn()} />)
    expect(screen.getByText(FIELDS.TO_CONCEPT)).toBeInTheDocument()
  })

  it('uses configured labels in realization details and filter summaries', () => {
    const { result } = renderHook(() => useFilterTooltip(realization))
    render(
      <ConceptModalDataContext.Provider value={{ modalData: { realization } }}>
        <ConceptRealizationModalContent />
        {result.current}
      </ConceptModalDataContext.Provider>
    )

    for (const label of Object.values(FIELDS)) {
      expect(screen.getByLabelText(label)).toBeInTheDocument()
      expect(screen.getByText(`${label}:`)).toBeInTheDocument()
    }
  })

  it('uses configured labels in both table column sets', () => {
    const Wrapper = ({ children }) => (
      <UserContext.Provider value={{ isAdmin: false }}>
        <RealizationsContext.Provider value={{ filters: {}, getPendingRealizationItem: vi.fn(), updateFilters: vi.fn() }}>
          <TemplatesContext.Provider value={{ filters: {}, getPendingTemplateAction: vi.fn(), updateFilters: vi.fn() }}>
            <SelectedContext.Provider value={{ updateSelected: vi.fn() }}>
              <SelectedSettingsContext.Provider value={{ updateSettings: vi.fn() }}>
                {children}
              </SelectedSettingsContext.Provider>
            </SelectedContext.Provider>
          </TemplatesContext.Provider>
        </RealizationsContext.Provider>
      </UserContext.Provider>
    )

    const { result } = renderHook(() => ({
      realizations: useRealizationColumns({}),
      templates: useTemplateColumns({}),
    }), { wrapper: Wrapper })

    for (const columns of Object.values(result.current)) {
      expect(columns.find(column => column.field === 'linkName').headerName).toBe(FIELDS.LINK_NAME)
      expect(columns.find(column => column.field === 'linkValue').headerName).toBe(FIELDS.LINK_VALUE)
      expect(columns.find(column => column.field === 'toConcept').headerName).toBe(FIELDS.TO_CONCEPT)
    }
  })

  it.each([
    ['realization', createDeleteRealizationContent],
    ['template', createDeleteTemplateContent],
  ])('uses configured labels in the %s delete dialog', (kind, createContent) => {
    const Content = createContent()
    render(<Content {...{ [kind]: realization }} />)

    for (const label of Object.values(FIELDS)) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('keeps CSV headers independent of the configured UI labels', () => {
    const Wrapper = ({ children }) => (
      <AppModalContext.Provider value={{ beginProcessing: vi.fn(), setModal: vi.fn(), setModalData: vi.fn() }}>
        <ConfigContext.Provider value={{ apiFns: {} }}>
          <RealizationsContext.Provider value={{ filteredRealizations: [], filters: {} }}>
            <TemplatesContext.Provider value={{ byAvailable: false, filteredTemplates: [], filters: {} }}>
              <UserContext.Provider value={{ user: {} }}>{children}</UserContext.Provider>
            </TemplatesContext.Provider>
          </RealizationsContext.Provider>
        </ConfigContext.Provider>
      </AppModalContext.Provider>
    )

    renderHook(() => {
      useRealizationsExport()
      useTemplatesExport()
    }, { wrapper: Wrapper })

    expect(csvExport).toHaveBeenCalledTimes(2)
    for (const [options] of csvExport.mock.calls) {
      expect(options.headers).toEqual(['Concept', 'Link Name', 'To Concept', 'Link Value', 'Last Updated'])
    }
  })
})
