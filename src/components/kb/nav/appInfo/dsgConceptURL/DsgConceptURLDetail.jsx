import { use } from 'react'

import BaseURLDetail from '@/components/kb/nav/appInfo/baseURL/BaseURLDetail'
import ConfigContext from '@/contexts/config/ConfigContext'

import DsgConceptURLActions from './DsgConceptURLActions'
import DsgConceptURLContent from './DsgConceptURLContent'
import CONFIG from '@/lib/config'

const { EDIT_TITLE, EDIT_TOOLTIP, FIELD_LABEL } = CONFIG.APP_INFO.DSG_CONCEPT

const DsgConceptURLDetail = ({ onEditComplete }) => {
  const { dsgConceptUrl } = use(ConfigContext)

  return (
    <BaseURLDetail
      Actions={DsgConceptURLActions}
      Content={DsgConceptURLContent}
      baseUrl={dsgConceptUrl}
      editTooltip={EDIT_TOOLTIP}
      label={FIELD_LABEL}
      modalDataValueKey='selectedDsgConceptUrl'
      onEditComplete={onEditComplete}
      title={EDIT_TITLE}
    />
  )
}

export default DsgConceptURLDetail
