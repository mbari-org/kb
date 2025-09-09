import { usePanelModalOperationsContext, usePanelModalDataContext } from '@/contexts/panel/modal/Context'

import ConceptTitle from '@/components/common/ConceptTitle'
import PendingItemActions from '@/components/kb/panels/history/pending/PendingItemActions'
import PendingItemDetail from '@/components/kb/panels/history/pending/PendingItemDetail'

import { pendingActionText } from '@/lib/kb/model/history'

const usePendingItemModal = () => {
  const { createModal } = usePanelModalOperationsContext()

  const open = ({ conceptName, item }) => {
    if (!item) return

    const ContentView = () => {
      const { modalData } = usePanelModalDataContext()
      return <PendingItemDetail {...modalData} />
    }

    createModal({
      actionsComponent: PendingItemActions,
      contentComponent: ContentView,
      titleComponent: ConceptTitle,
      data: { conceptName, item: { ...item, action: pendingActionText(item.action) } },
      minWidth: 625,
    })
  }

  return open
}

export default usePendingItemModal
