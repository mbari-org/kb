import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it } from 'vitest'

import PanelTable from '@/components/common/panel/PanelTable'
import PanelTableHeader from '@/components/common/panel/PanelTableHeader'
import TablePanel from '@/components/common/panel/TablePanel'
import theme from '@/lib/theme'

describe('PanelTableHeader spacing', () => {
  it('aligns the filter bottom with the header content without adding table spacing', () => {
    render(
      <ThemeProvider theme={theme}>
        <TablePanel
          panelTable={
            <PanelTable
              tableData={<span>Table data</span>}
              tableHeader={<PanelTableHeader headerMiddle={<span>Filters</span>} />}
            />
          }
        />
      </ThemeProvider>
    )

    const centered = screen.getByText('Filters').parentElement
    expect(centered).toHaveStyle({
      bottom: theme.spacing(1),
      position: 'absolute',
      transform: 'translateX(-50%)',
    })
    expect(centered.parentElement).toHaveStyle({ paddingBottom: theme.spacing(1) })
    expect(centered.parentElement).not.toHaveStyle({ marginBottom: theme.spacing(1) })
    const tablePanel = centered.parentElement.parentElement.parentElement.parentElement
    expect(tablePanel).toHaveStyle({ overflow: 'visible' })
    expect(screen.getByText('Table data').parentElement).toHaveStyle({ overflow: 'auto' })
  })
})
