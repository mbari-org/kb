import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import RealizationTitle from '@/components/kb/panels/realizations/form/RealizationTitle'
import { useRealizationsModalDataContext } from '@/contexts/panels/realizations/modal'

vi.mock('@/contexts/panels/realizations/modal', () => ({
  useRealizationsModalDataContext: vi.fn(),
}))

describe('RealizationTitle', () => {
  it('renders concept name from realization modal data', () => {
    useRealizationsModalDataContext.mockReturnValue({
      modalData: {
        realization: {
          concept: 'marine organism',
        },
      },
    })

    render(<RealizationTitle />)

    expect(screen.getByText('Concept: marine organism')).toBeInTheDocument()
  })

  it('uses modal concept value when rerendered with a different row selection', () => {
    useRealizationsModalDataContext
      .mockReturnValueOnce({
        modalData: {
          realization: {
            concept: 'zooid',
          },
        },
      })
      .mockReturnValueOnce({
        modalData: {
          realization: {
            concept: 'Eubacteria',
          },
        },
      })

    const { rerender } = render(<RealizationTitle />)
    expect(screen.getByText('Concept: zooid')).toBeInTheDocument()

    rerender(<RealizationTitle />)
    expect(screen.getByText('Concept: Eubacteria')).toBeInTheDocument()
  })
})
