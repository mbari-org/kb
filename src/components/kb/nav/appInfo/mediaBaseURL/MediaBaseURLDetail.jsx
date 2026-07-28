import { use } from 'react'
import BaseURLDetail from '@/components/kb/nav/appInfo/baseURL/BaseURLDetail'

import MediaBaseURLActions from './MediaBaseURLActions'
import MediaBaseURLContent from './MediaBaseURLContent'

import ConfigContext from '@/contexts/config/ConfigContext'

const MediaBaseURLDetail = ({ onEditComplete }) => {
  const { mediaBaseURL } = use(ConfigContext)

  return (
    <BaseURLDetail
      Actions={MediaBaseURLActions}
      Content={MediaBaseURLContent}
      baseUrl={mediaBaseURL}
      editTooltip='Edit Media Base URL'
      label='Media Base URL'
      modalDataValueKey='selectedMediaBaseURL'
      onEditComplete={onEditComplete}
      title='Edit Media Base URL'
    />
  )
}

export default MediaBaseURLDetail
