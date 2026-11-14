import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import StagedChildDetail from '@/components/kb/panels/concepts/concept/change/staged/children/StagedChildDetail'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import { CONCEPT_STATE } from '@/lib/constants'

describe('StagedChildDetail', () => {
  it('displays the parent of a staged child addition', () => {
    render(
      <ConceptContext.Provider value={{ isPhylogenyRoot: false }}>
        <StagedChildDetail
          parentName='parent-concept'
          stagedChild={{ action: CONCEPT_STATE.CHILD.ADD, updates: { name: 'child', author: 'author' } }}
        />
      </ConceptContext.Provider>
    )

    expect(screen.getByText('Parent:').parentElement).toHaveTextContent('parent-concept')
    expect(screen.getByText('Author:').parentElement).toHaveTextContent('author')
  })
})
