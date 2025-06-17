import { createContext } from 'react'

const HistoryContext = createContext({
  count: 0,
  data: [],
  handleSortChange: () => {},
  nextPage: () => {},
  pageState: { limit: 0, offset: 0 },
  prevPage: () => {},
  resetPagination: () => {},
  selectedConcept: null,
  selectedType: null,
  setPageSize: () => {},
  sortOrder: 'desc',
})

export default HistoryContext
