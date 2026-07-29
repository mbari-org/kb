import BaseURLContent from '@/components/kb/nav/appInfo/baseURL/BaseURLContent'

import CONFIG from '@/lib/config'

const DsgConceptURLContent = () => {
  return (
    <BaseURLContent
      fieldLabel='DSG Concept URL'
      helperText={CONFIG.APP_INFO.HELPER_TEXT.DSG}
      modalDataValueKey='selectedDsgConceptUrl'
    />
  )
}

export default DsgConceptURLContent
