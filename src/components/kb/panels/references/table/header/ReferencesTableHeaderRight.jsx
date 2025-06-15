import PanelAddButton from '@/components/common/panel/PanelAddButton'

import useAddReferenceModal from '@/components/kb/panels/references/form/add/useAddReferenceModal'

const ReferencesTableHeaderRight = () => {
  const addReferenceModal = useAddReferenceModal()

  return <PanelAddButton onClick={addReferenceModal} />
}

export default ReferencesTableHeaderRight
