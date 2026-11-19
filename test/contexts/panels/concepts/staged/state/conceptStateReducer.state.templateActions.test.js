import { describe, expect, it } from 'vitest'

import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import * as templates from '@/lib/concept/state/templates'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'

const { RESET, TEMPLATE } = CONCEPT_STATE

const baseStagedState = {
  aliasIndex: 0,
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  deleteConcept: false,
  media: [],
  mediaIndex: 0,
  name: { action: 'None', value: 'dingo', extent: '' },
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

const initialState = { ...baseStagedState, ...templates.initialState(concept, []) }

const newTemplate = { concept: 'dingo', linkName: 'likes', toConcept: 'fish', linkValue: 'z' }

const stage = (stagedState, type, update) => conceptStateReducer(stagedState, { type, update, initialState })

const findByLinkName = (stagedState, linkName) => stagedState.templates.find(item => item.linkName === linkName)

describe('conceptStateReducer template actions', () => {
  it('ADD appends a staged template with a stateId', () => {
    const staged = stage(structuredClone(initialState), TEMPLATE.ADD, { templateItem: newTemplate })

    expect(staged.templates).toHaveLength(3)
    expect(staged.templates[2]).toMatchObject({
      linkName: 'likes',
      action: TEMPLATE.ADD,
      stateId: expect.any(String),
    })
    expect(templates.isModified(initialState, staged)).toBe(true)
  })

  it('EDIT marks an existing template and keeps its server id', () => {
    const eats = findByLinkName(initialState, 'eats')
    const staged = stage(structuredClone(initialState), TEMPLATE.EDIT, {
      templateStateId: eats.stateId,
      templateItem: { ...eats, linkValue: 'edited' },
    })

    expect(findByLinkName(staged, 'eats')).toMatchObject({ id: 11, linkValue: 'edited', action: TEMPLATE.EDIT })
  })

  it('EDIT keeps the ADD action for a staged template', () => {
    let staged = stage(structuredClone(initialState), TEMPLATE.ADD, { templateItem: newTemplate })
    const added = findByLinkName(staged, 'likes')
    staged = stage(staged, TEMPLATE.EDIT, {
      templateStateId: added.stateId,
      templateItem: { ...added, toConcept: 'crab' },
    })

    expect(findByLinkName(staged, 'likes')).toMatchObject({ toConcept: 'crab', action: TEMPLATE.ADD })
  })

  it('DELETE marks an existing template and removes a staged ADD', () => {
    const chases = findByLinkName(initialState, 'chases')
    let staged = stage(structuredClone(initialState), TEMPLATE.DELETE, { templateStateId: chases.stateId })
    expect(findByLinkName(staged, 'chases').action).toBe(TEMPLATE.DELETE)

    staged = stage(staged, TEMPLATE.ADD, { templateItem: newTemplate })
    const added = findByLinkName(staged, 'likes')
    staged = stage(staged, TEMPLATE.DELETE, { templateStateId: added.stateId })

    expect(findByLinkName(staged, 'likes')).toBeUndefined()
  })

  it('RESET restores one edited template and leaves staged ADDs', () => {
    const eats = findByLinkName(initialState, 'eats')
    let staged = stage(structuredClone(initialState), TEMPLATE.EDIT, {
      templateStateId: eats.stateId,
      templateItem: { ...eats, linkValue: 'edited' },
    })
    staged = stage(staged, TEMPLATE.ADD, { templateItem: newTemplate })

    staged = stage(staged, RESET.TEMPLATES, { templates: initialState.templates, stateId: eats.stateId })

    expect(findByLinkName(staged, 'eats')).toMatchObject({ linkValue: 'x', action: CONCEPT_STATE.NO_ACTION })
    expect(findByLinkName(staged, 'likes').action).toBe(TEMPLATE.ADD)
  })

  it('RESET removes only the targeted staged ADD', () => {
    let staged = stage(structuredClone(initialState), TEMPLATE.ADD, {
      templateItem: { ...newTemplate, linkName: 'alpha' },
    })
    staged = stage(staged, TEMPLATE.ADD, { templateItem: { ...newTemplate, linkName: 'beta' } })
    const alpha = findByLinkName(staged, 'alpha')

    staged = stage(staged, RESET.TEMPLATES, { templates: initialState.templates, stateId: alpha.stateId })

    expect(staged.templates.map(item => item.linkName)).toEqual(['eats', 'chases', 'beta'])
  })

  it('RESET without a stateId restores the initial templates', () => {
    const eats = findByLinkName(initialState, 'eats')
    let staged = stage(structuredClone(initialState), TEMPLATE.DELETE, { templateStateId: eats.stateId })
    staged = stage(staged, TEMPLATE.ADD, { templateItem: newTemplate })

    staged = stage(staged, RESET.TEMPLATES, { templates: initialState.templates })

    expect(staged.templates).toEqual(initialState.templates)
    expect(templates.isModified(initialState, staged)).toBe(false)
  })
})
