import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PanelModalProvider } from '@/contexts/panel/modal'
import {
  RealizationsModalProvider,
  useRealizationsModalOperationsContext,
} from '@/contexts/panels/realizations/modal'
import { createRealizationOnClose } from '@/components/kb/panels/realizations/form/realizationModalUtils'

const CONTENT_TEXT = 'realization edit content'

const EditContent = () => {
  const { closeModal } = useRealizationsModalOperationsContext()
  return (
    <div>
      <div>{CONTENT_TEXT}</div>
      <button onClick={() => closeModal()} type='button'>
        attempt close
      </button>
      <button onClick={() => closeModal(true)} type='button'>
        confirmed close
      </button>
    </div>
  )
}

const Harness = () => {
  const { createModal, updateModalData, modal, processing } = useRealizationsModalOperationsContext()

  return (
    <>
      <button
        onClick={() =>
          createModal({
            contentComponent: EditContent,
            data: { hasChanges: true, confirmDiscard: false },
            onClose: createRealizationOnClose(updateModalData),
          })
        }
        type='button'
      >
        open
      </button>
      {!processing && modal && modal()}
    </>
  )
}

const renderHarness = () =>
  render(
    <PanelModalProvider>
      <RealizationsModalProvider>
        <Harness />
      </RealizationsModalProvider>
    </PanelModalProvider>
  )

describe('Realizations edit modal close guard', () => {
  it('vetoes plain close with unsaved changes but honors confirmed close after save', async () => {
    const user = userEvent.setup()
    renderHarness()

    await user.click(screen.getByRole('button', { name: 'open' }))
    await waitFor(() => {
      expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'attempt close' }))
    expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'confirmed close' }))
    await waitFor(() => {
      expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument()
    })
  })
})
