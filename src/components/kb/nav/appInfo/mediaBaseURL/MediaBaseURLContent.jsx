import BaseURLContent from '@/components/kb/nav/appInfo/baseURL/BaseURLContent'

import CONFIG from '@/lib/config'

const { DESCRIPTION, FIELD_LABEL } = CONFIG.APP_INFO.MEDIA_URL

const MediaBaseURLContent = () => {
  return <BaseURLContent description={DESCRIPTION} fieldLabel={FIELD_LABEL} modalDataValueKey='selectedMediaBaseURL' />
}

export default MediaBaseURLContent
