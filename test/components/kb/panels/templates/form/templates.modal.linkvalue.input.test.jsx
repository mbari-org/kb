import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import LinkValueInput from '@/components/kb/panels/templates/form/LinkValueInput'
import ConfigContext from '@/contexts/config/ConfigContext'
import { useTemplatesModalDataContext } from '@/contexts/panels/templates/modal'
import { getDescendantNames } from '@/lib/model/concept'

vi.mock('@/contexts/panels/templates/modal', () => ({
  useTemplatesModalDataContext: vi.fn(),
}))

vi.mock('@/lib/model/concept', () => ({
  getDescendantNames: vi.fn(),
}))

const renderWithConfigContext = (props = {}) =>
  render(
    <ConfigContext value={{ apiFns: { apiPayload: vi.fn() } }}>
      <LinkValueInput onChange={vi.fn()} value='' {...props} />
    </ConfigContext>
  )

describe('LinkValueInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders plain text field when no toConcept is selected', async () => {
    useTemplatesModalDataContext.mockReturnValue({
      modalData: {
        template: {
          concept: 'marine organism',
          toConcept: '',
        },
      },
    })
    getDescendantNames.mockResolvedValue([])

    renderWithConfigContext({ value: 'Eubacteria' })

    const input = screen.getByRole('textbox', { name: /link value/i })
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('Eubacteria')

    await waitFor(() => {
      expect(getDescendantNames).not.toHaveBeenCalled()
    })
  })

  it('auto-selects and still allows free-form input when only one option exists', async () => {
    const onChange = vi.fn()
    useTemplatesModalDataContext.mockReturnValue({
      modalData: {
        template: {
          concept: 'marine organism',
          toConcept: 'zooid',
        },
      },
    })
    getDescendantNames.mockResolvedValue([])

    renderWithConfigContext({ onChange, value: '' })

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ target: { value: 'nil' } })
    })

    const input = screen.getByRole('combobox', { name: /link value/i })
    await waitFor(() => {
      expect(input).toBeEnabled()
    })

    fireEvent.change(input, { target: { value: 'custom-link-value' } })
    expect(onChange).toHaveBeenCalledWith({ target: { value: 'custom-link-value' } })
  })
})
