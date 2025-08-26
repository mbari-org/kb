import { use } from 'react'

import PendingAliasItem from '@/components/kb/panels/history/pending/PendingAliasItem'
import PendingChildItem from '@/components/kb/panels/history/pending/PendingChildItem'
import PendingMediaItem from '@/components/kb/panels/history/pending/PendingMediaItem'
import PendingNameItem from '@/components/kb/panels/history/pending/PendingNameItem'
import PendingParentItem from '@/components/kb/panels/history/pending/PendingParentItem'
import PendingRankItem from '@/components/kb/panels/history/pending/PendingRankItem'
import PendingRealizationItem from '@/components/kb/panels/history/pending/PendingRealizationItem'

import { isPendingName } from '@/lib/kb/state/name'

import { usePanelModalDataContext } from '@/contexts/panels/PanelModalContexts'

import UserContext from '@/contexts/user/UserContext'

import { HISTORY_FIELD } from '@/lib/constants'

const PendingItemDetail = props => {
  const { modalData } = usePanelModalDataContext()
  const { user } = use(UserContext)
  const { item } = { ...modalData, ...props }

  if (!item?.field) return null

  switch (item.field) {
    case HISTORY_FIELD.RANK:
      return <PendingRankItem item={item} />

    case HISTORY_FIELD.NAME:
      if (isPendingName(item)) {
        return <PendingNameItem item={item} user={user} />
      }
      return <PendingAliasItem item={item} />

    case HISTORY_FIELD.PARENT:
      return <PendingParentItem item={item} />

    case HISTORY_FIELD.CHILD:
      return <PendingChildItem item={item} />

    case HISTORY_FIELD.REALIZATION:
      return <PendingRealizationItem item={item} />

    case HISTORY_FIELD.MEDIA:
      return <PendingMediaItem item={item} />

    case HISTORY_FIELD.ALIAS:
      return <PendingAliasItem item={item} />

    default:
      throw new Error(`Unknown pending item field type: ${item.field}`)
  }
}

export default PendingItemDetail
