import { use } from 'react'
import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

const TemplatesHeaderTitle = () => {
  const { available, filters } = use(TemplatesContext)
  const isFiltered = Object.values(filters).some(value => value)

  const title = `${isFiltered ? 'Filtered ' : ''} ${available ? 'Available ' : ''} Templates`

  return <PanelHeaderTitle title={title} />
}

export default TemplatesHeaderTitle