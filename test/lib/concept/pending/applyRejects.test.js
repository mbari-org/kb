import { describe, expect, it } from 'vitest'

import applyRejects from '@/lib/concept/pending/applyRejects'
import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const renamedConcept = () => ({
  name: 'dingo-2',
  parent: 'root',
  aliases: [{ name: 'dingo' }],
  alternateNames: ['dingo'],
  children: [],
})

describe('applyRejects', () => {
  it('restores the old primary name on a rename reject without touching aliases', () => {
    const concept = renamedConcept()
    const renameItem = {
      concept: 'dingo-2',
      field: HISTORY_FIELD.NAME,
      action: ACTION.EDIT,
      oldValue: 'dingo',
      newValue: 'dingo-2',
    }

    applyRejects(concept, [renameItem])

    expect(concept.name).toBe('dingo')
    expect(concept.alternateNames).toEqual(['dingo'])
  })

  it('removes the added alias on an alias add reject', () => {
    const concept = renamedConcept()
    const aliasAddItem = {
      concept: 'dingo-2',
      field: HISTORY_FIELD.ALIAS,
      action: ACTION.ADD,
      newValue: 'dingo',
    }

    applyRejects(concept, [aliasAddItem])

    expect(concept.name).toBe('dingo-2')
    expect(concept.alternateNames).toEqual([])
  })

  it('restores the old alias on an alias edit reject', () => {
    const concept = {
      ...renamedConcept(),
      aliases: [{ name: 'wild-dingo' }],
      alternateNames: ['wild-dingo'],
    }
    const aliasEditItem = {
      concept: 'dingo-2',
      field: HISTORY_FIELD.ALIAS,
      action: ACTION.EDIT,
      oldValue: 'dingo',
      newValue: 'wild-dingo',
    }

    applyRejects(concept, [aliasEditItem])

    expect(concept.name).toBe('dingo-2')
    expect(concept.alternateNames).toEqual(['dingo'])
  })
})
