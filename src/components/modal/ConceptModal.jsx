import { use } from 'react'

import ModalShell from '@/components/modal/ModalShell'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import ConceptModalDataContext from '@/contexts/panels/concepts/modal/ConceptModalDataContext'
import ConceptModalProcessingContext from '@/contexts/panels/concepts/modal/ConceptModalProcessingContext'

const ConceptModal = () => {
  const { closeModal } = use(ConceptModalContext)
  const { modal } = use(ConceptModalDataContext)
  const { processing, processingMessage } = use(ConceptModalProcessingContext)

  if (!modal) {
    return null
  }

  return (
    <ModalShell
      {...modal}
      closeModal={closeModal}
      processing={Boolean(processing)}
      processingMessage={processingMessage}
    />
  )
}

export default ConceptModal
