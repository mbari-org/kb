import { use } from 'react'

import BaseURLActions from '@/components/kb/nav/appInfo/baseURL/BaseURLActions'
import ConfigContext from '@/contexts/config/ConfigContext'
import { PREFS } from '@/lib/constants/prefs.js'
import CONFIG from '@/lib/config'

const dsgBaseUrlKey = PREFS.APP.DSG.BASE_URL.KEY
const { INVALID_URL, SAVE_CONFIRM } = CONFIG.APP_INFO.DSG_CONCEPT.EDIT

const DsgBaseURLActions = () => {
  const { dsgBaseUrl } = use(ConfigContext)
  return (
    <BaseURLActions
      actionName='DSG concept URL'
      currentBaseUrl={dsgBaseUrl}
      invalidUrlAlert={INVALID_URL}
      modalDataValueKey='selectedDsgBaseUrl'
      preferenceKey={dsgBaseUrlKey}
      saveConfirmAlert={SAVE_CONFIRM}
    />
  )
}

export default DsgBaseURLActions
