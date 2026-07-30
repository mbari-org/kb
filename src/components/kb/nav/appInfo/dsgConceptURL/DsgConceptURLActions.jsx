import { use } from 'react'

import BaseURLActions from '@/components/kb/nav/appInfo/baseURL/BaseURLActions'
import ConfigContext from '@/contexts/config/ConfigContext'
import { PREFS } from '@/lib/constants/prefs.js'
import CONFIG from '@/lib/config'

const dsgConceptUrlKey = PREFS.APP.DSG.CONCEPT_URL.KEY
const { INVALID_URL, SAVE_CONFIRM } = CONFIG.APP_INFO.DSG_CONCEPT.EDIT

const DsgConceptURLActions = () => {
  const { dsgConceptUrl } = use(ConfigContext)
  return (
    <BaseURLActions
      actionName='DSG concept URL'
      currentBaseUrl={dsgConceptUrl}
      invalidUrlAlert={INVALID_URL}
      modalDataValueKey='selectedDsgConceptUrl'
      preferenceKey={dsgConceptUrlKey}
      saveConfirmAlert={SAVE_CONFIRM}
    />
  )
}

export default DsgConceptURLActions
