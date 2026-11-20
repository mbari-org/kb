import Title from '@/components/common/factory/Title'

import { usePanelModalDataContext } from '@/contexts/panel/modal'

import CONFIG from '@/lib/config'

const PendingItemTitle = () => {
  const { modalData } = usePanelModalDataContext()
  const { conceptName } = modalData

  if (!conceptName) return <Title title={CONFIG.UI.LOADING.CONCEPT} />

  return <Title title={`Concept: ${conceptName}`} />
}

export default PendingItemTitle
