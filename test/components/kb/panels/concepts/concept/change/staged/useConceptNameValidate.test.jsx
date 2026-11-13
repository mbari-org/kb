import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import useConceptNameValidate from '@/components/kb/panels/concepts/concept/change/staged/useConceptNameValidate'

import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import CONFIG from '@/lib/config'

const CHANGE_NAME = CONFIG.PANELS.CONCEPTS.MODALS.STRUCTURE.CHANGE_NAME

const baseStaged = {
  aliases: [],
  children: [],
  name: { action: 'None', value: 'dingo', extent: '' },
}

const wrapperFor = ({ pendingHistory = [], names = ['dingo', 'wolf'] }) => {
  const Wrapper = ({ children }) => (
    <PanelDataContext.Provider value={{ pendingHistory }}>
      <TaxonomyContext.Provider value={{ getNames: () => names }}>
        <ConceptModalDataContext.Provider value={{ modalData: {} }}>
          <ConceptStagedContext.Provider value={{ stagedState: baseStaged }}>
            {children}
          </ConceptStagedContext.Provider>
        </ConceptModalDataContext.Provider>
      </TaxonomyContext.Provider>
    </PanelDataContext.Provider>
  )
  Wrapper.displayName = 'UseConceptNameValidateTestWrapper'
  return Wrapper
}

describe('useConceptNameValidate', () => {
  it('rejects names that collide with pending add concepts (G6)', () => {
    const pendingHistory = [
      {
        action: ACTION.ADD,
        field: HISTORY_FIELD.CHILD,
        newValue: 'pending-kid',
      },
    ]

    const { result } = renderHook(
      () => useConceptNameValidate({ value: 'pending-kid' }, { name: true }),
      { wrapper: wrapperFor({ pendingHistory }) }
    )

    expect(result.current.isValidName).toBe(false)
    expect(result.current.nameHelperText).toBe(CHANGE_NAME.NAME_PENDING_ADD)
  })

  it('still rejects taxonomy collisions', () => {
    const { result } = renderHook(
      () => useConceptNameValidate({ value: 'wolf' }, { name: true }),
      { wrapper: wrapperFor({}) }
    )

    expect(result.current.isValidName).toBe(false)
    expect(result.current.nameHelperText).toBe(CHANGE_NAME.NAME_EXISTS)
  })
})
