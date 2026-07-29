import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import LinkNameInput from '@/components/kb/panels/templates/form/LinkNameInput'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'
import { SELECTED } from '@/lib/constants/selected.js'

const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES

const renderWithTemplatesContext = (templatesContextValue, props = {}) =>
  render(
    <TemplatesContext value={templatesContextValue}>
      <LinkNameInput onChange={vi.fn()} value='' {...props} />
    </TemplatesContext>
  )

describe('LinkNameInput', () => {
  it('renders plain text input when concept filter is not set', () => {
    const onChange = vi.fn()
    renderWithTemplatesContext(
      {
        filters: {},
        filteredTemplates: [],
      },
      { onChange, value: 'initial' }
    )

    const input = screen.getByRole('textbox', { name: /link name/i })
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('initial')

    fireEvent.change(input, { target: { value: 'updated' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('renders autocomplete when concept filter is set and emits normalized values', () => {
    const onChange = vi.fn()
    renderWithTemplatesContext(
      {
        filters: { [FILTERS.CONCEPT]: 'marine organism' },
        filteredTemplates: [{ linkName: 'curling' }, { linkName: 'curling' }, { linkName: 'grazing' }],
      },
      { onChange, value: '' }
    )

    const input = screen.getByRole('combobox', { name: /link name/i })
    fireEvent.change(input, { target: { value: 'curling' } })

    expect(onChange).toHaveBeenCalledWith({ target: { value: 'curling' } })
  })
})
