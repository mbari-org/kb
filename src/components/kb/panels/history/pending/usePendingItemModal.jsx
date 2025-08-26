import { usePanelModalOperationsContext } from '@/contexts/panels/PanelModalContexts'
import PendingItemDetail from '@/components/kb/panels/history/pending/PendingItemDetail'
import PendingItemActions from '@/components/kb/panels/history/pending/PendingItemActions'

import { pendingActionText } from '@/lib/kb/model/history'

const usePendingItemModal = () => {
  const { createModal } = usePanelModalOperationsContext()

  const open = ({ conceptName, item }) => {
    if (!item) return

    createModal({
      title: `Concept: ${conceptName}`,
      content: data => <PendingItemDetail {...data} />,
      actions: data => <PendingItemActions {...data} />,
      minWidth: 625,
      data: { conceptName, item: { ...item, action: pendingActionText(item.action) } },
    })
  }

  return open
}

export default usePendingItemModal
