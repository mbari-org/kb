import Title from '@/components/common/factory/Title'

import { useTemplatesModalDataContext } from '@/contexts/panels/templates/modal'

const TemplateTitle = () => {
  const { modalData } = useTemplatesModalDataContext()

  const conceptName = modalData.template.concept
  return <Title title={`Concept: ${conceptName}`} />
}

export default TemplateTitle
