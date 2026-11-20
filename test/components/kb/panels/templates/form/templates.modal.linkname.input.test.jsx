import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import LinkNameInput from '@/components/kb/panels/templates/form/LinkNameInput'
import CONFIG from '@/lib/config'

describe('LinkNameInput', () => {
  it('renders plain text input when there are no link name options', () => {
    const onChange = vi.fn()
    render(<LinkNameInput linkNameOptions={null} onChange={onChange} value='initial' />)

    const input = screen.getByRole('textbox', { name: name => name.includes(CONFIG.LINK.FIELDS.LINK_NAME) })
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('initial')

    fireEvent.change(input, { target: { value: 'updated' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('renders autocomplete when link name options are provided and emits normalized values', () => {
    const onChange = vi.fn()
    render(<LinkNameInput linkNameOptions={['curling', 'grazing']} onChange={onChange} value='' />)

    const input = screen.getByRole('combobox', { name: name => name.includes(CONFIG.LINK.FIELDS.LINK_NAME) })
    fireEvent.change(input, { target: { value: 'curling' } })

    expect(onChange).toHaveBeenCalledWith({ target: { value: 'curling' } })
  })
})
