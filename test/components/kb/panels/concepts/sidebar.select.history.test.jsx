import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import SidebarSelectAuxiliary from '@/components/kb/panels/concepts/sidebar/select/SidebarSelectAuxiliary'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import useHistorySelection from '@/contexts/selected/useHistorySelection'

vi.mock('@/components/kb/panels/concepts/sidebar/select/ConceptExport', () => ({
  default: () => null,
}))

vi.mock('@/components/kb/panels/concepts/sidebar/select/ConceptScroll', () => ({
  default: () => null,
}))

vi.mock('@/components/common/NavHistoryButton', () => ({
  default: ({ disabled, dropItems, label, onClick, onItemSelect }) => (
    <>
      <button disabled={disabled} onClick={onClick} type='button'>{label}</button>
      {dropItems.map((item, index) => (
        <button key={index} onClick={() => onItemSelect(index)} type='button'>
          {label} item {index}: {item}
        </button>
      ))}
    </>
  ),
}))

const HistoryHarness = ({ initialHistory, prepareConceptSwitch }) => {
  const concepts = useHistorySelection('A')

  return (
    <ConceptContext value={{ concept: { name: concepts.current() }, prepareConceptSwitch }}>
      <SidebarSelectAuxiliary concepts={concepts} onScrollToConcept={() => {}} />
      <button onClick={() => concepts.init(initialHistory)} type='button'>initialize</button>
      <div data-testid='position'>{concepts.getPosition()}</div>
      <div data-testid='concept'>{concepts.current()}</div>
    </ConceptContext>
  )
}

describe('concept sidebar history', () => {
  afterEach(() => vi.unstubAllGlobals())

  it.each([
    ['previous', ['A', 'A'], 1, 'previous', 0],
    ['next', ['A', 'A'], 0, 'next', 1],
    ['previous menu', ['A', 'B', 'A'], 2, 'previous item 1: A', 0],
    ['next menu', ['A', 'B', 'A'], 0, 'next item 1: A', 2],
  ])('moves %s to the current concept without a loading overlay', (_label, state, position, button, expected) => {
    const prepareConceptSwitch = vi.fn()
    const requestFrame = vi.fn()
    vi.stubGlobal('requestAnimationFrame', requestFrame)
    render(<HistoryHarness initialHistory={{ state, position }} prepareConceptSwitch={prepareConceptSwitch} />)

    fireEvent.click(screen.getByRole('button', { name: 'initialize' }))
    fireEvent.click(screen.getByRole('button', { name: button, exact: true }))

    expect(prepareConceptSwitch).not.toHaveBeenCalled()
    expect(requestFrame).not.toHaveBeenCalled()
    expect(screen.getByTestId('concept')).toHaveTextContent('A')
    expect(screen.getByTestId('position')).toHaveTextContent(String(expected))
  })

  it('shows the overlay and waits for both animation frames when switching concepts', () => {
    const prepareConceptSwitch = vi.fn()
    const frames = []
    vi.stubGlobal('requestAnimationFrame', callback => frames.push(callback))
    render(
      <HistoryHarness
        initialHistory={{ state: ['A', 'B', 'C'], position: 2 }}
        prepareConceptSwitch={prepareConceptSwitch}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'initialize' }))
    fireEvent.click(screen.getByRole('button', { name: 'previous item 1: A' }))

    expect(prepareConceptSwitch).toHaveBeenCalledOnce()
    expect(screen.getByTestId('concept')).toHaveTextContent('C')
    act(() => frames.shift()())
    expect(screen.getByTestId('concept')).toHaveTextContent('C')
    act(() => frames.shift()())
    expect(screen.getByTestId('concept')).toHaveTextContent('A')
    expect(screen.getByTestId('position')).toHaveTextContent('0')
  })
})
