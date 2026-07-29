import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import TemplateTitle from '@/components/kb/panels/templates/form/TemplateTitle'
import { useTemplatesModalDataContext } from '@/contexts/panels/templates/modal'

vi.mock('@/contexts/panels/templates/modal', () => ({
  useTemplatesModalDataContext: vi.fn(),
}))

describe('TemplateTitle', () => {
  it('renders concept name from template modal data', () => {
    useTemplatesModalDataContext.mockReturnValue({
      modalData: {
        template: {
          concept: 'marine organism',
        },
      },
    })

    render(<TemplateTitle />)

    expect(screen.getByText('Concept: marine organism')).toBeInTheDocument()
  })

  it('uses modal concept value when rerendered with a different row selection', () => {
    useTemplatesModalDataContext
      .mockReturnValueOnce({
        modalData: {
          template: {
            concept: 'zooid',
          },
        },
      })
      .mockReturnValueOnce({
        modalData: {
          template: {
            concept: 'Eubacteria',
          },
        },
      })

    const { rerender } = render(<TemplateTitle />)
    expect(screen.getByText('Concept: zooid')).toBeInTheDocument()

    rerender(<TemplateTitle />)
    expect(screen.getByText('Concept: Eubacteria')).toBeInTheDocument()
  })
})
