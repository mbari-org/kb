import { useMemo } from 'react'
import { Box } from '@mui/material'

import PanelHeader from './PanelHeader'
import PanelTable from './PanelTable'
import PanelTableHeader from './PanelTableHeader'
import PanelTitle from './PanelTitle'
import TablePanel from './TablePanel'

/**
 * Hook that provides factory methods for creating panel table components
 * @returns {Object} Factory methods for creating panel components
 */
const usePanelFactory = () => {
  return useMemo(() => {
    const createPanelHeader = ({ headerLeft, headerTitle, headerRight, sx = {} } = {}) => (
      <PanelHeader
        headerLeft={headerLeft}
        headerTitle={<PanelTitle title={headerTitle} />}
        headerRight={headerRight}
        sx={sx}
      />
    )

    const createTableHeader = ({ headerLeft, headerRight, sx = {} } = {}) => (
      <PanelTableHeader headerLeft={headerLeft} headerRight={headerRight} sx={sx} />
    )

    const createTableData = ({ content, sx = {} } = {}) => (
      <Box sx={{ height: '100%', ...sx }}>{content}</Box>
    )

    const createTablePanel = ({ header, tableHeader, tableData, sx = {} } = {}) => (
      <TablePanel
        header={createPanelHeader(header)}
        panelTable={
          <PanelTable
            tableHeader={createTableHeader(tableHeader)}
            tableData={createTableData(tableData)}
          />
        }
        sx={sx}
      />
    )

    return {
      createPanelHeader,
      createTableHeader,
      createTableData,
      createTablePanel,
    }
  }, [])
}

export default usePanelFactory
