import { use } from 'react'
import PanelHeaderTitle from '@/components/common/panel/PanelHeaderTitle'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

const TemplatesHeaderTitle = () => {
  const { byAvailable, filters } = use(TemplatesContext)

  const available = byAvailable ? 'Available ' : ''
  const filtered = Object.values(filters).some(value => value) ? 'Filtered ' : ''
  const all = (available === '' && filtered === '') ? 'All ' : ''

  const title = `${all}${filtered}${available}Templates`

  return <PanelHeaderTitle title={title} />
}

export default TemplatesHeaderTitle