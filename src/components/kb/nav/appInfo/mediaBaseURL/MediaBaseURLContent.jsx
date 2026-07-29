import BaseURLContent from '@/components/kb/nav/appInfo/baseURL/BaseURLContent'

import CONFIG from '@/lib/config'

const MediaBaseURLContent = () => {
  return (
    <BaseURLContent
      fieldLabel='Media Base URL'
      helperText={CONFIG.APP_INFO.HELPER_TEXT.MEDIA}
      modalDataValueKey='selectedMediaBaseURL'
    />
  )
}

export default MediaBaseURLContent
