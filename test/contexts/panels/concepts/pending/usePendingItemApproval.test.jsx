import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'

import usePendingItemApproval from '@/contexts/panels/concepts/pending/usePendingItemApproval'

import { PENDING } from '@/lib/constants/pending.js'

const item = { id: 'p1' }

const approvalFor = ({ modalData = {}, pendingConfirm = null }) => {
  const pending = vi.fn(key => (key === PENDING.DATA.CONFIRM ? pendingConfirm : []))

  const Wrapper = ({ children }) => (
    <ConceptContext.Provider value={{ pending }}>
      <ConceptModalDataContext.Provider value={{ modalData }}>{children}</ConceptModalDataContext.Provider>
    </ConceptContext.Provider>
  )

  return renderHook(() => usePendingItemApproval(item), { wrapper: Wrapper }).result.current
}

describe('usePendingItemApproval', () => {
  it('marks every item as other once only Close is allowed', () => {
    expect(approvalFor({ modalData: { closeOnly: true } })).toBe(PENDING.APPROVAL.OTHER)
  })

  it('leaves items unmarked when no approval is pending', () => {
    expect(approvalFor({})).toBeNull()
  })
})
