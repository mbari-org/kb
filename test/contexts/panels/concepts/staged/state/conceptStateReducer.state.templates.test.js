import { stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { isStateModified } from '@/lib/concept/state/state'
import * as templates from '@/lib/concept/state/templates'
import { describe, expect, it } from 'vitest'

const baseStagedState = {
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
  realizations: [],
  realizationIndex: 0,
  templates: [],
}

const initialState = { ...baseStagedState }

describe('conceptStateReducer templates', () => {
  it('verifies isModified when templates differ', () => {
    const stagedState = {
      ...baseStagedState,
      templates: [
        {
          linkName: 'sameAs',
          toConcept: 'Other',
          linkValue: 'x',
          action: 'None',
          index: 0,
        },
      ],
    }

    expect(templates.isModified(initialState, stagedState)).toBe(true)
    expect(isStateModified({ initialState, stagedState })).toBe(true)
  })

  it('verifies isModified is false when templates are same', () => {
    const templateItem = {
      linkName: 'sameAs',
      toConcept: 'Other',
      linkValue: 'x',
      action: 'None',
      index: 0,
    }
    const stateWithTemplates = {
      ...baseStagedState,
      templates: [templateItem],
    }

    expect(templates.isModified(stateWithTemplates, { ...stateWithTemplates })).toBe(false)
    expect(isStateModified({ initialState: stateWithTemplates, stagedState: stateWithTemplates })).toBe(
      false
    )
  })

  it('verifies stateUpdates from templates matches staged when modified', () => {
    const stagedTemplates = [
      {
        linkName: 'sameAs',
        toConcept: 'Staged Concept',
        linkValue: 'v1',
        action: 'None',
        index: 0,
      },
    ]
    const stagedState = {
      ...baseStagedState,
      templates: stagedTemplates,
    }

    const templatesStateUpdates = templates.stateUpdates(initialState, stagedState)
    expect(templatesStateUpdates).toEqual({
      templates: {
        initial: [],
        staged: stagedTemplates,
      },
    })

    expect(templatesStateUpdates.templates.initial).toEqual([])
    expect(templatesStateUpdates.templates.staged).toHaveLength(1)
    expect(templatesStateUpdates.templates.staged[0]).toMatchObject({
      linkName: 'sameAs',
      toConcept: 'Staged Concept',
      linkValue: 'v1',
    })

    const fullStateUpdates = stateUpdates(initialState, stagedState)
    expect(fullStateUpdates.templates).toBeDefined()
    expect(fullStateUpdates.templates.initial).toEqual([])
    expect(fullStateUpdates.templates.staged).toEqual(stagedTemplates)
  })

  it('verifies stateUpdates returns empty when templates are same', () => {
    const templateItem = {
      linkName: 'sameAs',
      toConcept: 'Other',
      linkValue: 'x',
      action: 'None',
      index: 0,
    }
    const stateWithTemplates = {
      ...baseStagedState,
      templates: [templateItem],
    }

    const templatesStateUpdates = templates.stateUpdates(stateWithTemplates, stateWithTemplates)
    expect(templatesStateUpdates).toEqual({})
  })

  it('full flow: staged templates differ, verify stateUpdates and isModified, then match initial', () => {
    const initialTemplates = [
      {
        linkName: 'sameAs',
        toConcept: 'Original',
        linkValue: 'v',
        action: 'None',
        index: 0,
      },
    ]
    const initial = { ...baseStagedState, templates: initialTemplates }

    const stagedTemplates = [
      {
        ...initialTemplates[0],
        toConcept: 'Modified',
        linkValue: 'v2',
      },
    ]
    const stagedState = { ...baseStagedState, templates: stagedTemplates }

    expect(templates.isModified(initial, stagedState)).toBe(true)
    expect(isStateModified({ initialState: initial, stagedState })).toBe(true)

    let updates = templates.stateUpdates(initial, stagedState)
    expect(updates.templates.initial).toEqual(initialTemplates)
    expect(updates.templates.staged).toEqual(stagedTemplates)
    expect(updates.templates.staged[0].toConcept).toBe('Modified')
    expect(updates.templates.staged[0].linkValue).toBe('v2')

    const resetStagedState = { ...baseStagedState, templates: initialTemplates }
    expect(templates.isModified(initial, resetStagedState)).toBe(false)
    expect(templates.stateUpdates(initial, resetStagedState)).toEqual({})
  })
})
