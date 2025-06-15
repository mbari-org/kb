import { Box } from '@mui/material'

import HistoryTableHeader from '../../HistoryTableHeader'
import HistoryTableData from './HistoryTableData'

const HistoryTable = ({
  columns,
  count,
  data,
  handleSortChange,
  hideFooter = false,
  limit,
  nextPage,
  offset,
  prevPage,
  setPageSize,
  sortOrder,
  title,
  titleTopMargin = 0,
  hasConceptSelect = false,
}) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <HistoryTableHeader
        count={count}
        handleSortChange={handleSortChange}
        sortOrder={sortOrder}
        title={title}
        titleTopMargin={titleTopMargin}
        hasConceptSelect={hasConceptSelect}
      />
      <HistoryTableData
        columns={columns}
        count={count}
        data={data}
        hideFooter={hideFooter}
        limit={limit}
        nextPage={nextPage}
        offset={offset}
        prevPage={prevPage}
        setPageSize={setPageSize}
        sortOrder={sortOrder}
      />
    </Box>
  )
}

export default HistoryTable
