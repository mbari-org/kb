import BaseURLContent from '@/components/kb/nav/appInfo/baseURL/BaseURLContent'

import CONFIG from '@/lib/config'

const MediaBaseURLContent = () => {
  return (
    <BaseURLContent
      description={CONFIG.APP_INFO.DESCRIPTION.MEDIA}
      fieldLabel='Media Base URL'
      modalDataValueKey='selectedMediaBaseURL'
    />
  )
}

export default MediaBaseURLContent
