import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import StagedContent from '@/components/kb/panels/concepts/concept/change/staged/modal/StagedContent'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'

import * as realizations from '@/lib/concept/state/realizations'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'

const { REALIZATION } = CONCEPT_STATE

const baseState = {
  aliasIndex: 0,
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  deleteConcept: false,
  media: [],
  mediaIndex: 0,
  name: { action: 'None', value: '', extent: '' },
  parent: { action: 'None', value: '' },
  rank: { action: 'None', level: '', name: '' },
  realizationIndex: 0,
  templates: [],
}

const initialState = {
  ...baseState,
  ...realizations.initialState({ realizations: [{ id: 11, linkName: 'zebra', toConcept: 'Zed', linkValue: 'z' }] }, []),
}

const stage = (stagedState, type, update) => conceptStateReducer(stagedState, { type, update, initialState })

const renderStagedContent = stagedState =>
  render(
    <ConfigContext.Provider value={{ apiFns: { apiResult: vi.fn(async () => 0) } }}>
      <PanelDataContext.Provider value={{ getReferences: vi.fn(() => []) }}>
        <ConceptModalContext.Provider value={{ closeModal: vi.fn() }}>
          <ConceptContext.Provider value={{ initialState }}>
            <ConceptStagedContext.Provider value={{ confirmReset: null, stagedState }}>
              <StagedContent />
            </ConceptStagedContext.Provider>
          </ConceptContext.Provider>
        </ConceptModalContext.Provider>
      </PanelDataContext.Provider>
    </ConfigContext.Provider>
  )

describe('StagedContent realization rows', () => {
  it('shows each staged realization ADD under its own link name', () => {
    let stagedState = structuredClone(initialState)
    stagedState = stage(stagedState, REALIZATION.ADD, {
      realizationItem: { linkName: 'alpha', toConcept: 'Ay', linkValue: 'a' },
    })
    stagedState = stage(stagedState, REALIZATION.ADD, {
      realizationItem: { linkName: 'middle', toConcept: 'Em', linkValue: 'm' },
    })

    renderStagedContent(stagedState)

    const headers = screen.getAllByText('Add Realization:').map(title => title.parentElement.textContent)
    expect(headers).toEqual(['Add Realization:alpha', 'Add Realization:middle'])
  })

  it('shows an edited realization after a staged ADD with its own initial values', () => {
    let stagedState = structuredClone(initialState)
    stagedState = stage(stagedState, REALIZATION.ADD, {
      realizationItem: { linkName: 'alpha', toConcept: 'Ay', linkValue: 'a' },
    })
    const zebra = stagedState.realizations.find(item => item.linkName === 'zebra')
    stagedState = stage(stagedState, REALIZATION.EDIT, {
      realizationStateId: zebra.stateId,
      realizationItem: { ...zebra, linkValue: 'edited' },
    })

    renderStagedContent(stagedState)

    expect(screen.getByText('Edit Realization:').parentElement).toHaveTextContent('zebra')
  })
})
