import BaseURLContent from '@/components/kb/nav/appInfo/baseURL/BaseURLContent'

import CONFIG from '@/lib/config'

const DsgConceptURLContent = () => {
  return (
    <BaseURLContent
      description={CONFIG.APP_INFO.DESCRIPTION.DSG}
      fieldLabel='DSG Concept URL'
      modalDataValueKey='selectedDsgConceptUrl'
    />
  )
}

export default DsgConceptURLContent
