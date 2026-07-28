import { use } from 'react'
import ConfigContext from '@/contexts/config/ConfigContext'
import BaseURLActions from '@/components/kb/nav/appInfo/baseURL/BaseURLActions'
import { PREFS } from '@/lib/constants/prefs.js'
import CONFIG from '@/text'

const MediaBaseUrlKey = PREFS.APP.MEDIA.BASE_URL.KEY
const { INVALID_URL, SAVE_CONFIRM } = CONFIG.PANELS.ABOUT_HELP.MEDIA_BASE_URL.ALERT

const MediaBaseURLActions = () => {
  const { mediaBaseURL } = use(ConfigContext)
  return (
    <BaseURLActions
      actionName='media base URL'
      currentBaseUrl={mediaBaseURL}
      invalidUrlAlert={INVALID_URL}
      modalDataValueKey='selectedMediaBaseURL'
      preferenceKey={MediaBaseUrlKey}
      saveConfirmAlert={SAVE_CONFIRM}
    />
  )
}

export default MediaBaseURLActions
