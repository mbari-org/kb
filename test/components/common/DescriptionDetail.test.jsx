import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ThemeProvider } from '@mui/material/styles'

import DescriptionDetail from '@/components/common/DescriptionDetail'
import kbTheme from '@/lib/theme'

const renderDescriptionDetail = props =>
  render(
    <ThemeProvider theme={kbTheme}>
      <DescriptionDetail {...props} />
    </ThemeProvider>
  )

describe('DescriptionDetail', () => {
  it('renders a string detail as text', () => {
    renderDescriptionDetail({ description: 'DSG Link Error', detail: 'The page is not reachable.' })

    expect(screen.getByText('DSG Link Error')).toBeInTheDocument()
    expect(screen.getByText('The page is not reachable.')).toBeInTheDocument()
    expect(screen.queryByText('0:')).not.toBeInTheDocument()
  })

  it('renders an object detail as field/value entries', () => {
    renderDescriptionDetail({
      description: 'Details',
      detail: { link: 'https://dsg.example.com/dsg/#/view/root' },
    })

    expect(screen.getByText('Link:')).toBeInTheDocument()
    expect(screen.getByText('https://dsg.example.com/dsg/#/view/root')).toBeInTheDocument()
  })
})
