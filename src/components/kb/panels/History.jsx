import HistoryPanel from '@/components/kb/panels/history/HistoryPanel'

import HistoryProvider from '@/contexts/panels/history/HistoryProvider'

const History = () => {
  return (
    <HistoryProvider>
      <HistoryPanel />
    </HistoryProvider>
  )
}

export default History
