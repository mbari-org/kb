import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import useHasRelatedData from '@/components/kb/panels/concepts/concept/change/staged/name/useHasRelatedData'
import { relatedDataCounts } from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'

vi.mock('@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    relatedDataCounts: vi.fn(async () => []),
  }
})

const mutable = { getReferences: vi.fn(() => []) }
const configValue = { apiFns: { apiPayload: vi.fn() } }

const wrapper = ({ children }) => (
  <ConfigContext.Provider value={configValue}>
    <PanelDataContext.Provider value={{ getReferences: mutable.getReferences }}>
      {children}
    </PanelDataContext.Provider>
  </ConfigContext.Provider>
)

describe('useHasRelatedData', () => {
  it('does not refetch when getReferences identity changes', async () => {
    vi.clearAllMocks()
    mutable.getReferences = vi.fn(() => [])

    const { rerender } = renderHook(() => useHasRelatedData('dingo'), { wrapper })

    await vi.waitFor(() => expect(relatedDataCounts).toHaveBeenCalledTimes(1))

    mutable.getReferences = vi.fn(() => [])
    rerender()

    await new Promise(resolve => setTimeout(resolve, 20))
    expect(relatedDataCounts).toHaveBeenCalledTimes(1)
  })

  it('refetches when the concept name changes', async () => {
    vi.clearAllMocks()
    mutable.getReferences = vi.fn(() => [])

    const { rerender } = renderHook(({ name }) => useHasRelatedData(name), {
      wrapper,
      initialProps: { name: 'dingo' },
    })

    await vi.waitFor(() => expect(relatedDataCounts).toHaveBeenCalledTimes(1))

    rerender({ name: 'coyote' })

    await vi.waitFor(() => expect(relatedDataCounts).toHaveBeenCalledTimes(2))
  })
})
