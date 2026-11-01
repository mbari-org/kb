import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import AppInfoEditLayout from '@/components/kb/nav/appInfo/AppInfoEditLayout'

describe('AppInfoEditLayout', () => {
  it('renders a single clickable VALUE hint', () => {
    const onApplyHint = vi.fn()

    render(
      <AppInfoEditLayout
        hint={{ TEXT: 'At MBARI use', VALUE: 'marine organism' }}
        onApplyHint={onApplyHint}
      />
    )

    const link = screen.getByRole('button', { name: 'marine organism' })
    fireEvent.click(link)

    expect(onApplyHint).toHaveBeenCalledWith('marine organism')
  })

  it('renders each VALUES entry as a clickable hint', () => {
    const onApplyHint = vi.fn()

    render(
      <AppInfoEditLayout
        hint={{ TEXT: 'At MBARI use', VALUES: ['alpha', 'beta'] }}
        onApplyHint={onApplyHint}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'alpha' }))
    fireEvent.click(screen.getByRole('button', { name: 'beta' }))

    expect(onApplyHint).toHaveBeenNthCalledWith(1, 'alpha')
    expect(onApplyHint).toHaveBeenNthCalledWith(2, 'beta')
  })

  it('honors VALUE when both VALUE and VALUES are present', () => {
    const onApplyHint = vi.fn()

    render(
      <AppInfoEditLayout
        hint={{ TEXT: 'At MBARI use', VALUE: 'preferred', VALUES: ['alpha', 'beta'] }}
        onApplyHint={onApplyHint}
      />
    )

    expect(screen.getByRole('button', { name: 'preferred' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'alpha' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'beta' })).not.toBeInTheDocument()
  })
})
