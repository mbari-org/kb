import { use } from 'react'
import BaseURLDetail from '@/components/kb/nav/appInfo/baseURL/BaseURLDetail'

import MediaBaseURLActions from './MediaBaseURLActions'
import MediaBaseURLContent from './MediaBaseURLContent'

import ConfigContext from '@/contexts/config/ConfigContext'

import CONFIG from '@/lib/config'

const { EDIT_TITLE, EDIT_TOOLTIP, FIELD_LABEL } = CONFIG.APP_INFO.MEDIA_URL

const MediaBaseURLDetail = ({ onEditComplete }) => {
  const { mediaBaseURL } = use(ConfigContext)

  return (
    <BaseURLDetail
      Actions={MediaBaseURLActions}
      Content={MediaBaseURLContent}
      baseUrl={mediaBaseURL}
      editTooltip={EDIT_TOOLTIP}
      label={FIELD_LABEL}
      modalDataValueKey='selectedMediaBaseURL'
      onEditComplete={onEditComplete}
      title={EDIT_TITLE}
    />
  )
}

export default MediaBaseURLDetail
