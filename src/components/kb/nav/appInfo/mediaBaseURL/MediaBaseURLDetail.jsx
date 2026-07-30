import { use } from 'react'
import BaseURLDetail from '@/components/kb/nav/appInfo/baseURL/BaseURLDetail'

import MediaBaseURLActions from './MediaBaseURLActions'
import MediaBaseURLContent from './MediaBaseURLContent'

import ConfigContext from '@/contexts/config/ConfigContext'

import CONFIG from '@/lib/config'

const { EDIT, FIELD_LABEL } = CONFIG.APP_INFO.MEDIA_URL
const { TITLE, TOOLTIP } = EDIT

const MediaBaseURLDetail = ({ onEditComplete }) => {
  const { mediaBaseURL } = use(ConfigContext)

  return (
    <BaseURLDetail
      Actions={MediaBaseURLActions}
      Content={MediaBaseURLContent}
      baseUrl={mediaBaseURL}
      editTooltip={TOOLTIP}
      label={FIELD_LABEL}
      modalDataValueKey='selectedMediaBaseURL'
      onEditComplete={onEditComplete}
      title={TITLE}
    />
  )
}

export default MediaBaseURLDetail
