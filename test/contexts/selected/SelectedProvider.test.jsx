import { use, useEffect } from 'react'
import { act, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedProvider from '@/contexts/selected/SelectedProvider'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

const createHistorySelection = initialValue => {
  let currentValue = initialValue

  return {
    current: vi.fn(() => currentValue),
    push: vi.fn(value => {
      currentValue = value
    }),
  }
}

const SelectedProbe = ({ onChange }) => {
  const selected = use(SelectedContext)

  useEffect(() => {
    onChange(selected)
  }, [onChange, selected])

  return null
}

const renderSelectedProvider = ({ conceptSelection, getConceptPrimaryName }) => {
  const getSettingsRef = { current: null }
  const markSettingsDirtyRef = { current: null }
  const onInitSettingsRef = { current: null }
  const panelSelection = createHistorySelection('Concepts')
  let selectedContext

  render(
    <TaxonomyContext.Provider value={{ getConceptPrimaryName }}>
      <PreferencesContext.Provider
        value={{
          conceptSelection,
          getSettingsRef,
          isLoading: false,
          markSettingsDirtyRef,
          onInitSettingsRef,
          panelSelection,
        }}
      >
        <SelectedProvider>
          <SelectedProbe
            onChange={value => {
              selectedContext = value
            }}
          />
        </SelectedProvider>
      </PreferencesContext.Provider>
    </TaxonomyContext.Provider>
  )

  return {
    panelSelection,
    selectedContext: () => selectedContext,
  }
}

describe('SelectedProvider', () => {
  it('pushes canonical concept names to history when an alias is selected', () => {
    const conceptSelection = createHistorySelection('root')
    const { selectedContext } = renderSelectedProvider({
      conceptSelection,
      getConceptPrimaryName: conceptName => {
        if (conceptName === 'dingo alias') {
          return 'dingo'
        }
        return conceptName
      },
    })

    act(() => {
      selectedContext().updateSelected({ concept: 'dingo alias' })
    })

    expect(conceptSelection.push).toHaveBeenCalledWith('dingo')
    expect(conceptSelection.push).not.toHaveBeenCalledWith('dingo alias')
  })

  it('does not push when an alias resolves to the currently selected concept name', () => {
    const conceptSelection = createHistorySelection('dingo')
    const { selectedContext } = renderSelectedProvider({
      conceptSelection,
      getConceptPrimaryName: conceptName => {
        if (conceptName === 'dingo alias') {
          return 'dingo'
        }
        return conceptName
      },
    })

    act(() => {
      selectedContext().updateSelected({ concept: 'dingo alias' })
    })

    expect(conceptSelection.push).not.toHaveBeenCalled()
  })
})
