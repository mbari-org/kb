import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import useStructureChoices from '@/components/kb/panels/concepts/concept/change/staged/structure/useStructureChoices'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ACTION } from '@/lib/constants'
import { CONCEPT } from '@/lib/constants/concept.js'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/lib/config'

const DISABLED = CONFIG.CONCEPT.STRUCTURE.DISABLED

const baseStaged = {
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  [CONCEPT.FIELD.DELETE]: false,
  media: [],
  name: { action: 'None', value: 'dingo', extent: '' },
  parent: { action: 'None', value: 'root' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  templates: [],
}

const wrapperFor = ({ concept, pendingMap, stagedState, isRoot = false }) => {
  const pending = key => pendingMap[key] || []
  const Wrapper = ({ children }) => (
    <TaxonomyContext.Provider value={{ isRoot: () => isRoot }}>
      <ConceptContext.Provider value={{ concept, initialState: baseStaged, pending }}>
        <ConceptStagedContext.Provider value={{ stagedState }}>
          {children}
        </ConceptStagedContext.Provider>
      </ConceptContext.Provider>
    </TaxonomyContext.Provider>
  )
  Wrapper.displayName = 'UseStructureChoicesTestWrapper'
  return Wrapper
}

describe('useStructureChoices', () => {
  it('disables all structure actions on a pending-add concept (G1)', () => {
    const concept = { name: 'new-kid', children: [] }
    const pendingMap = {
      [PENDING.DATA.CONCEPT]: [],
      [PENDING.DATA.PARENT]: [
        {
          action: ACTION.ADD,
          field: HISTORY_FIELD.CHILD,
          newValue: 'new-kid',
        },
      ],
    }

    const { result } = renderHook(() => useStructureChoices(), {
      wrapper: wrapperFor({ concept, pendingMap, stagedState: baseStaged }),
    })

    expect(result.current.disableChangeName).toBe(true)
    expect(result.current.disableChangeParent).toBe(true)
    expect(result.current.disableAddChild).toBe(true)
    expect(result.current.disableDelete).toBe(true)
    expect(result.current.disableChangeNameReason).toBe(DISABLED.PENDING_ADD)
  })

  it('disables change name when a rename is pending (G2)', () => {
    const concept = { name: 'dingo', children: [] }
    const pendingMap = {
      [PENDING.DATA.CONCEPT]: [
        {
          action: ACTION.EDIT,
          concept: 'wolf',
          field: HISTORY_FIELD.NAME,
          newValue: 'wolf',
        },
      ],
      [PENDING.DATA.PARENT]: [],
    }

    const { result } = renderHook(() => useStructureChoices(), {
      wrapper: wrapperFor({ concept, pendingMap, stagedState: baseStaged }),
    })

    expect(result.current.disableChangeName).toBe(true)
    expect(result.current.disableChangeNameReason).toBe(DISABLED.PENDING_NAME)
  })

  it('disables change parent when a parent change is pending', () => {
    const concept = { name: 'dingo', children: [] }
    const pendingMap = {
      [PENDING.DATA.CONCEPT]: [
        {
          action: ACTION.EDIT,
          concept: 'dingo',
          field: HISTORY_FIELD.PARENT,
          oldValue: 'root',
          newValue: 'object',
        },
      ],
      [PENDING.DATA.PARENT]: [],
    }

    const { result } = renderHook(() => useStructureChoices(), {
      wrapper: wrapperFor({ concept, pendingMap, stagedState: baseStaged }),
    })

    expect(result.current.disableChangeParent).toBe(true)
    expect(result.current.disableChangeParentReason).toBe(DISABLED.PENDING_PARENT)
  })

  it('disables change parent and delete when the concept itself has a pending delete (G4)', () => {
    const concept = { name: 'dingo', children: [] }
    const pendingMap = {
      [PENDING.DATA.CONCEPT]: [],
      [PENDING.DATA.PARENT]: [
        {
          action: ACTION.DELETE,
          field: HISTORY_FIELD.CHILD,
          oldValue: 'dingo',
        },
      ],
    }

    const { result } = renderHook(() => useStructureChoices(), {
      wrapper: wrapperFor({ concept, pendingMap, stagedState: baseStaged }),
    })

    expect(result.current.disableChangeParent).toBe(true)
    expect(result.current.disableChangeParentReason).toBe(DISABLED.PENDING_DELETE)
    expect(result.current.disableDelete).toBe(true)
    expect(result.current.disableDeleteReason).toBe(DISABLED.PENDING_DELETE)
  })

  it('allows delete when the concept has other pending items', () => {
    const concept = { name: 'dingo', children: [] }
    const pendingMap = {
      [PENDING.DATA.CONCEPT]: [
        {
          action: ACTION.EDIT,
          concept: 'dingo',
          field: HISTORY_FIELD.NAME,
          newValue: 'dingo',
        },
        {
          action: ACTION.ADD,
          concept: 'dingo',
          field: HISTORY_FIELD.MEDIA,
          newValue: 'http://example.com/dingo.jpg',
        },
      ],
      [PENDING.DATA.PARENT]: [],
    }

    const { result } = renderHook(() => useStructureChoices(), {
      wrapper: wrapperFor({ concept, pendingMap, stagedState: baseStaged }),
    })

    expect(result.current.disableDelete).toBe(false)
    expect(result.current.disableChangeParent).toBe(false)
  })

  it('allows change name when the concept has non-rename pending items', () => {
    const concept = { name: 'dingo', children: [] }
    const pendingMap = {
      [PENDING.DATA.CONCEPT]: [
        {
          action: ACTION.ADD,
          concept: 'dingo',
          field: HISTORY_FIELD.MEDIA,
          newValue: 'http://example.com/dingo.jpg',
        },
      ],
      [PENDING.DATA.PARENT]: [],
    }

    const { result } = renderHook(() => useStructureChoices(), {
      wrapper: wrapperFor({ concept, pendingMap, stagedState: baseStaged }),
    })

    expect(result.current.disableChangeName).toBe(false)
  })

  it('disables delete when other staged edits exist (G3)', () => {
    const concept = { name: 'dingo', children: [] }
    const stagedState = {
      ...baseStaged,
      author: { action: CONCEPT_STATE.AUTHOR, value: 'me' },
    }
    const pendingMap = {
      [PENDING.DATA.CONCEPT]: [],
      [PENDING.DATA.PARENT]: [],
    }

    const { result } = renderHook(() => useStructureChoices(), {
      wrapper: wrapperFor({ concept, pendingMap, stagedState }),
    })

    expect(result.current.disableDelete).toBe(true)
    expect(result.current.disableDeleteReason).toBe(DISABLED.STAGED_OTHER)
  })
})
