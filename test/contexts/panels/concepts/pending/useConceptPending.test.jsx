import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import useConceptPending from '@/contexts/panels/concepts/pending/useConceptPending'

import { ACTION, HISTORY_FIELD, PENDING } from '@/lib/constants'

const childAdd = (concept, newValue) => ({
  id: `add-${newValue}`,
  concept,
  field: HISTORY_FIELD.CHILD,
  action: ACTION.ADD,
  newValue,
  creationTimestamp: '2026-11-25T12:00:00Z',
})

const aliasAdd = {
  id: 'p1',
  concept: 'A',
  field: HISTORY_FIELD.ALIAS,
  action: ACTION.ADD,
  newValue: 'alias A',
  creationTimestamp: '2026-11-26T12:08:00Z',
}

const wrapperFor = pendingHistory =>
  function Wrapper({ children }) {
    return <PanelDataContext.Provider value={{ pendingHistory }}>{children}</PanelDataContext.Provider>
  }

describe('useConceptPending', () => {
  it('keeps a pending child add under its recorded parent after the child is reparented', async () => {
    const spinningAdd = childAdd('data file', 'spinning')
    const behaviorAdd = childAdd('behavior', 'learning')
    const pendingHistory = [spinningAdd, childAdd('data file', 'dolphin'), behaviorAdd]
    const concept = { name: 'spinning', parent: 'behavior' }

    const { result } = renderHook(() => useConceptPending(concept), { wrapper: wrapperFor(pendingHistory) })

    await waitFor(() => expect(result.current.pending(PENDING.DATA.PARENT)).toEqual([spinningAdd, behaviorAdd]))
  })

  it('reads the pending list for the concept it is given on the same render', () => {
    const concept = { name: 'A', parent: 'object' }

    const { result } = renderHook(() => useConceptPending(concept), { wrapper: wrapperFor([aliasAdd]) })

    expect(result.current.pending(PENDING.DATA.CONCEPT)).toEqual([aliasAdd])
  })

  it('keeps a confirm while its pending items stay listed, even when the concept object is replaced', () => {
    const { result, rerender } = renderHook(({ current }) => useConceptPending(current), {
      initialProps: { current: { name: 'A', parent: 'object' } },
      wrapper: wrapperFor([aliasAdd]),
    })
    const confirm = { approval: PENDING.APPROVAL.REJECT, pendingIds: ['p1'] }

    act(() => result.current.setPendingConfirm(confirm))
    rerender({ current: { name: 'A', parent: 'object' } })

    expect(result.current.pending(PENDING.DATA.CONFIRM)).toEqual(confirm)
  })

  it('treats a confirm whose items are not listed as absent', () => {
    const { result } = renderHook(() => useConceptPending({ name: 'A', parent: 'object' }), {
      wrapper: wrapperFor([aliasAdd]),
    })

    act(() => result.current.setPendingConfirm({ approval: PENDING.APPROVAL.REJECT, pendingIds: ['gone'] }))

    expect(result.current.pending(PENDING.DATA.CONFIRM)).toBeNull()
  })

  it('clears the confirm when the concept changes to one without those items', () => {
    const { result, rerender } = renderHook(({ current }) => useConceptPending(current), {
      initialProps: { current: { name: 'A', parent: 'object' } },
      wrapper: wrapperFor([aliasAdd]),
    })

    act(() => result.current.setPendingConfirm({ approval: PENDING.APPROVAL.REJECT, pendingIds: ['p1'] }))
    rerender({ current: { name: 'B', parent: 'object' } })

    expect(result.current.pending(PENDING.DATA.CONFIRM)).toBeNull()
  })
})
