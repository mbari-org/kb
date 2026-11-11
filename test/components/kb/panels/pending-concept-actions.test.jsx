import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '@mui/material/styles'

import useAddTemplateButton from '@/components/kb/panels/templates/form/useAddTemplateButton'
import useTemplateColumns from '@/components/kb/panels/templates/table/data/useTemplateColumns'
import useAddRealizationButton from '@/components/kb/panels/realizations/form/useAddRealizationButton'
import useRealizationColumns from '@/components/kb/panels/realizations/table/data/useRealizationColumns'
import useAddReferenceButton from '@/components/kb/panels/references/table/header/useAddReferenceButton'
import useReferenceColumns from '@/components/kb/panels/references/table/data/useReferenceColumns'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'
import { ACTION, HISTORY_FIELD } from '@/lib/constants'
import theme from '@/lib/theme'

vi.mock('react-icons/md', () => ({ MdOutlineDeleteForever: () => <span>delete-icon</span> }))
vi.mock('react-icons/ci', () => ({ CiEdit: () => <span>edit-icon</span> }))
vi.mock('@/components/kb/panels/history/pending/usePendingItemModal', () => ({ default: () => vi.fn() }))
vi.mock('@/contexts/panels/templates/modal', () => ({
  useTemplatesModalOperationsContext: () => ({}),
  useTemplatesModalDataContext: () => ({}),
}))
vi.mock('@/contexts/panels/realizations/modal', () => ({
  useRealizationsModalOperationsContext: () => ({}),
  useRealizationsModalDataContext: () => ({}),
}))
vi.mock('@/contexts/panels/references/modal', () => ({
  useReferencesModalOperationsContext: () => ({}),
  useReferencesModalDataContext: () => ({}),
}))

const noop = () => {}
const row = { concept: 'another-row-concept' }

const TemplatesActions = () => {
  const addButton = useAddTemplateButton()
  const columns = useTemplateColumns({ deleteTemplateModal: noop, editTemplateModal: noop })
  return <>{addButton()}{columns[0].renderCell({ row })}</>
}

const RealizationsActions = () => {
  const addButton = useAddRealizationButton()
  const columns = useRealizationColumns({ deleteRealizationModal: noop, editRealizationModal: noop })
  return <>{addButton()}{columns[0].renderCell({ row })}</>
}

const ReferencesActions = () => {
  const addButton = useAddReferenceButton()
  const columns = useReferenceColumns({ deleteReferenceModal: noop, editReferenceModal: noop })
  return <>{addButton()}{columns[0].renderCell({ row })}</>
}

const Harness = ({ Panel, concept = 'selected', pendingHistory = [] }) => {
  const filters = { concept }
  return (
    <ThemeProvider theme={theme}>
      <UserContext value={{ isAdmin: true, isReadOnly: false }}>
        <PanelDataContext value={{ pendingHistory, templates: [], getConceptRealizations: () => [], isDoiUnique: noop }}>
          <TaxonomyContext value={{ loadConcept: noop }}>
            <SelectedContext value={{ updateSelected: noop }}>
              <SelectedSettingsContext value={{ updateSettings: noop }}>
                <TemplatesContext value={{ filters, getPendingTemplateAction: () => null, updateFilters: noop }}>
                  <RealizationsContext value={{ filters, getPendingRealizationItem: () => null, updateFilters: noop }}>
                    <ReferencesContext value={{ filters }}>
                      <Panel />
                    </ReferencesContext>
                  </RealizationsContext>
                </TemplatesContext>
              </SelectedSettingsContext>
            </SelectedContext>
          </TaxonomyContext>
        </PanelDataContext>
      </UserContext>
    </ThemeProvider>
  )
}

describe.each([
  ['Templates', TemplatesActions, true],
  ['Realizations', RealizationsActions, true],
  ['References', ReferencesActions, false],
])('%s pending Concept deletion', (_name, Panel, requiresConcept) => {
  it('updates Add and row actions as the selected Concept gains and clears a pending deletion', () => {
    const { rerender } = render(<Harness Panel={Panel} />)

    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled()
    expect(screen.getByText('delete-icon')).toBeInTheDocument()
    expect(screen.getByText('edit-icon')).toBeInTheDocument()

    rerender(
      <Harness
        Panel={Panel}
        pendingHistory={[{ concept: 'parent', field: HISTORY_FIELD.CHILD, action: ACTION.DELETE, oldValue: 'selected' }]}
      />
    )
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
    expect(screen.queryByText('delete-icon')).not.toBeInTheDocument()
    expect(screen.queryByText('edit-icon')).not.toBeInTheDocument()

    rerender(<Harness Panel={Panel} pendingHistory={[{ concept: 'selected', field: HISTORY_FIELD.NAME, action: ACTION.EDIT }]} />)
    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled()
    expect(screen.getByText('delete-icon')).toBeInTheDocument()
    expect(screen.getByText('edit-icon')).toBeInTheDocument()

    rerender(
      <Harness
        Panel={Panel}
        pendingHistory={[{ concept: 'parent', field: HISTORY_FIELD.CHILD, action: ACTION.DELETE, oldValue: 'other' }]}
      />
    )
    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled()
    expect(screen.getByText('edit-icon')).toBeInTheDocument()

    rerender(
      <Harness
        Panel={Panel}
        concept=''
        pendingHistory={[{ concept: 'parent', field: HISTORY_FIELD.CHILD, action: ACTION.DELETE, oldValue: 'selected' }]}
      />
    )
    expect(screen.getByRole('button', { name: 'Add' })).toHaveProperty('disabled', requiresConcept)
    expect(screen.getByText('delete-icon')).toBeInTheDocument()
  })

  it.each([
    [{ concept: 'parent', field: HISTORY_FIELD.CHILD, action: ACTION.ADD, newValue: 'selected' }],
    [{ concept: 'selected', field: HISTORY_FIELD.CHILD, action: ACTION.DELETE, oldValue: 'child' }],
    [{ concept: 'selected', field: HISTORY_FIELD.ALIAS, action: ACTION.DELETE, oldValue: 'selected' }],
  ])('allows editing for other pending actions', pendingItem => {
    const pendingHistory = [pendingItem]
    render(<Harness Panel={Panel} pendingHistory={pendingHistory} />)

    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled()
    expect(screen.getByText('delete-icon')).toBeInTheDocument()
    expect(screen.getByText('edit-icon')).toBeInTheDocument()
  })
})
