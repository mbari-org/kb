import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it } from 'vitest'

import PanelDataGrid from '@/components/common/panel/PanelDataGrid'
import color from '@/config/color.json'
import theme from '@/lib/theme'

describe('PanelDataGrid borders', () => {
  it('uses the configured color for the grid, row borders, column separators, and pagination border', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <PanelDataGrid
          columns={[{ field: 'name', headerName: 'Name' }]}
          paginationComponent={<div>Pagination</div>}
          paginationMode='client'
          rows={[{ id: 1, name: 'Example' }]}
        />
      </ThemeProvider>
    )

    const grid = screen.getByRole('grid').closest('.MuiDataGrid-root')
    const separator = container.querySelector('.MuiDataGrid-columnSeparator')
    const footer = screen.getByText('Pagination').parentElement

    expect(grid).toHaveStyle({ borderColor: color.COLOR.TABLE.BORDER })
    expect(getComputedStyle(grid).getPropertyValue('--DataGrid-rowBorderColor').trim())
      .toBe(color.COLOR.TABLE.BORDER)
    expect(separator).toHaveStyle({ color: color.COLOR.TABLE.BORDER })
    expect(footer).toHaveStyle({ borderTop: `1px solid ${color.COLOR.TABLE.BORDER}` })
  })
})
