import Title from '@/components/common/factory/Title'

import { useRealizationsModalDataContext } from '@/contexts/panels/realizations/modal'

const RealizationTitle = () => {
  const { modalData } = useRealizationsModalDataContext()

  const conceptName = modalData.realization.concept
  return <Title title={`Concept: ${conceptName}`} />
}

export default RealizationTitle
