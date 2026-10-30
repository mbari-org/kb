import { use } from 'react'

import BaseURLDetail from '@/components/kb/nav/appInfo/baseURL/BaseURLDetail'
import ConfigContext from '@/contexts/config/ConfigContext'

import DsgBaseURLActions from './DsgBaseURLActions'
import DsgBaseURLContent from './DsgBaseURLContent'
import CONFIG from '@/lib/config'
const { EDIT, FIELD_LABEL } = CONFIG.APP_INFO.DSG_CONCEPT
const { TITLE, TOOLTIP } = EDIT

const DsgBaseURLDetail = ({ onEditComplete }) => {
  const { dsgBaseUrl } = use(ConfigContext)

  return (
    <BaseURLDetail
      Actions={DsgBaseURLActions}
      Content={DsgBaseURLContent}
      baseUrl={dsgBaseUrl}
      editTooltip={TOOLTIP}
      label={FIELD_LABEL}
      modalDataValueKey='selectedDsgBaseUrl'
      onEditComplete={onEditComplete}
      title={TITLE}
    />
  )
}

export default DsgBaseURLDetail
