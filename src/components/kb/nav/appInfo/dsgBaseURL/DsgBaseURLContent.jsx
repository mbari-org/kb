import BaseURLContent from '@/components/kb/nav/appInfo/baseURL/BaseURLContent'

import CONFIG from '@/lib/config'
const { DESCRIPTION, DETAIL, FIELD_LABEL } = CONFIG.APP_INFO.DSG_CONCEPT

const DsgBaseURLContent = () => {
  return (
    <BaseURLContent
      description={DESCRIPTION}
      detail={DETAIL}
      fieldLabel={FIELD_LABEL}
      modalDataValueKey='selectedDsgBaseUrl'
    />
  )
}

export default DsgBaseURLContent
