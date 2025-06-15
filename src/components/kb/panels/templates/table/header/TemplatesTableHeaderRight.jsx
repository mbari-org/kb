import { use } from 'react'

import PanelAddButton from '@/components/common/panel/PanelAddButton'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import useAddTemplateModal from '@/components/kb/panels/templates/form/add/useAddTemplateModal'

const TemplatesTableHeaderRight = () => {
  const { addTemplate } = use(TemplatesContext)
  const addTemplateModal = useAddTemplateModal(addTemplate)

  return <PanelAddButton onClick={addTemplateModal} />
}

export default TemplatesTableHeaderRight
