import BaseURLContent from '@/components/kb/nav/appInfo/baseURL/BaseURLContent'

import CONFIG from '@/lib/config'
const { DESCRIPTION, DETAIL, FIELD_LABEL, HINT } = CONFIG.APP_INFO.DSG_CONCEPT_URL

const DsgBaseURLContent = () => {
  return (
    <BaseURLContent
      description={DESCRIPTION}
      detail={DETAIL}
      fieldLabel={FIELD_LABEL}
      hint={HINT}
      modalDataValueKey='selectedDsgBaseUrl'
    />
  )
}

export default DsgBaseURLContent
