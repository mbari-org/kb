import { use } from 'react'

import Actions from '@/components/modal/actions/Actions'

import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

const ConceptExportActions = () => {
  const { closeModal, modalData } = use(ConceptModalContext)

  const handleAction = action => {
    switch (action) {
      case 'Cancel': {
        closeModal()
        break
      }
      case 'Export': {
        // TODO: Implement export logic
        closeModal()
        break
      }
    }
  }

  return (
    <Actions
      colors={['cancel', 'main']}
      disabled={[false, !modalData.validInput]}
      labels={['Cancel', 'Export']}
      onAction={handleAction}
    />
  )
}

export default ConceptExportActions