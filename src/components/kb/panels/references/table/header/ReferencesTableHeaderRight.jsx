import { use } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'

import useAddReferenceModal from '@/components/kb/panels/references/form/add/useAddReferenceModal'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

const ReferencesTableHeaderRight = () => {
  const { addReference } = use(ReferencesContext)
  const addReferenceModal = useAddReferenceModal(addReference)

  return <PanelAddButton onClick={addReferenceModal} />
}

export default ReferencesTableHeaderRight
