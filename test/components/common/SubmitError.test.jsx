import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import SubmitError from '@/components/common/SubmitError'
import kbTheme from '@/lib/theme'

describe('SubmitError', () => {
  it('renders the error using the theme error color', () => {
    render(
      <ThemeProvider theme={kbTheme}>
        <SubmitError errorText='Config service: Failed access' />
      </ThemeProvider>
    )

    expect(screen.getByText('Config service: Failed access')).toHaveStyle({
      color: kbTheme.palette.error.main,
    })
  })
})
