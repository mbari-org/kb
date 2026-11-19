import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import StagedContent from '@/components/kb/panels/concepts/concept/change/staged/modal/StagedContent'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'

import * as templates from '@/lib/concept/state/templates'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'

const { TEMPLATE } = CONCEPT_STATE

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
  realizations: [],
  templates: [],
}

const concept = {
  templates: [
    { id: 11, concept: 'dingo', linkName: 'eats', toConcept: 'squid', linkValue: 'x' },
    { id: 22, concept: 'dingo', linkName: 'chases', toConcept: 'ball', linkValue: 'y' },
  ],
}

const initialState = { ...baseState, ...templates.initialState(concept, []) }

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

describe('StagedContent template rows', () => {
  it('shows staged template ADD, EDIT, and DELETE rows under their own names', () => {
    let stagedState = structuredClone(initialState)
    stagedState = stage(stagedState, TEMPLATE.ADD, {
      templateItem: { concept: 'dingo', linkName: 'likes', toConcept: 'fish', linkValue: 'z' },
    })
    const eats = stagedState.templates.find(item => item.linkName === 'eats')
    stagedState = stage(stagedState, TEMPLATE.EDIT, {
      templateStateId: eats.stateId,
      templateItem: { ...eats, linkValue: 'edited' },
    })
    const chases = stagedState.templates.find(item => item.linkName === 'chases')
    stagedState = stage(stagedState, TEMPLATE.DELETE, { templateStateId: chases.stateId })

    renderStagedContent(stagedState)

    expect(screen.getByText('Add Template:').parentElement).toHaveTextContent('likes')
    expect(screen.getByText('Edit Template:').parentElement).toHaveTextContent('eats')
    expect(screen.getByText('Delete Template:').parentElement).toHaveTextContent('chases')
  })
})
