import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import LinkValueInput from '@/components/kb/panels/templates/form/LinkValueInput'

describe('LinkValueInput', () => {
  it('renders a free-form text field', () => {
    const onChange = vi.fn()

    render(<LinkValueInput onChange={onChange} value='Eubacteria' />)

    const input = screen.getByRole('textbox', { name: /link value/i })
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('Eubacteria')

    fireEvent.change(input, { target: { value: 'custom-link-value' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('can be disabled', () => {
    render(<LinkValueInput disabled onChange={vi.fn()} value='' />)

    expect(screen.getByRole('textbox', { name: /link value/i })).toBeDisabled()
  })
})
