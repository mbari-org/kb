import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import ConceptAuthor from '@/components/kb/panels/concepts/concept/detail/ConceptAuthor'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

describe('Concepts panel - ConceptAuthor', () => {
  const renderAuthor = ({
    isEditing = true,
    initialAuthor = 'MBARI',
    stagedAuthor = 'MBARI',
    modifyConcept = vi.fn(),
  } = {}) => {
    render(
      <ConceptContext.Provider
        value={{
          isEditing,
          initialState: {
            author: {
              value: initialAuthor,
            },
          },
          stagedState: {
            author: {
              value: stagedAuthor,
            },
          },
          pending: () => [],
          modifyConcept,
        }}
      >
        <ConceptAuthor />
      </ConceptContext.Provider>
    )

    return { modifyConcept }
  }

  it('shows the staged author value in the Concepts panel author field', () => {
    renderAuthor({ stagedAuthor: 'Dingo Team' })

    expect(screen.getByRole('textbox', { name: /author/i })).toHaveValue('Dingo Team')
  })

  it('updates author through modifyConcept with correct payload on edit', () => {
    const { modifyConcept } = renderAuthor({ stagedAuthor: '' })

    const authorInput = screen.getByRole('textbox', { name: /author/i })
    fireEvent.change(authorInput, { target: { value: 'New Author' } })

    expect(modifyConcept).toHaveBeenCalled()
    expect(modifyConcept).toHaveBeenLastCalledWith({
      type: CONCEPT_STATE.AUTHOR,
      update: {
        field: CONCEPT.FIELD.AUTHOR,
        value: 'New Author',
        initialAuthor: {
          value: 'MBARI',
        },
      },
    })
  })
})
