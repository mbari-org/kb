import Title from '@/components/common/factory/Title'

import { usePanelModalDataContext } from '@/contexts/panel/modal/Context'

const PendingItemTitle = () => {
  const { modalData } = usePanelModalDataContext()
  const { conceptName } = modalData

  if (!conceptName) return <Title title='Concept: Loading...' />

  return <Title title={`Concept: ${conceptName}`} />
}

export default PendingItemTitle
