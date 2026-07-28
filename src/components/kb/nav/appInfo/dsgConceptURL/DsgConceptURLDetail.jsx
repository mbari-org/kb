import { use } from 'react'

import BaseURLDetail from '@/components/kb/nav/appInfo/baseURL/BaseURLDetail'
import ConfigContext from '@/contexts/config/ConfigContext'

import DsgConceptURLActions from './DsgConceptURLActions'
import DsgConceptURLContent from './DsgConceptURLContent'

const DsgConceptURLDetail = () => {
  const { dsgConceptUrl } = use(ConfigContext)

  return (
    <BaseURLDetail
      Actions={DsgConceptURLActions}
      Content={DsgConceptURLContent}
      baseUrl={dsgConceptUrl}
      editTooltip='Edit DSG Concept URL'
      label='DSG Concept URL'
      modalDataValueKey='selectedDsgConceptUrl'
      title='Edit DSG Concept URL'
    />
  )
}

export default DsgConceptURLDetail
