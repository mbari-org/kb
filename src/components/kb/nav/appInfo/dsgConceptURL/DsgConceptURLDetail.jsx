import { use } from 'react'

import BaseURLDetail from '@/components/kb/nav/appInfo/baseURL/BaseURLDetail'
import ConfigContext from '@/contexts/config/ConfigContext'

import DsgConceptURLActions from './DsgConceptURLActions'
import DsgConceptURLContent from './DsgConceptURLContent'
import CONFIG from '@/lib/config'
const { EDIT, FIELD_LABEL } = CONFIG.APP_INFO.DSG_CONCEPT
const { TITLE, TOOLTIP } = EDIT

const DsgConceptURLDetail = ({ onEditComplete }) => {
  const { dsgConceptUrl } = use(ConfigContext)

  return (
    <BaseURLDetail
      Actions={DsgConceptURLActions}
      Content={DsgConceptURLContent}
      baseUrl={dsgConceptUrl}
      editTooltip={TOOLTIP}
      label={FIELD_LABEL}
      modalDataValueKey='selectedDsgConceptUrl'
      onEditComplete={onEditComplete}
      title={TITLE}
    />
  )
}

export default DsgConceptURLDetail
