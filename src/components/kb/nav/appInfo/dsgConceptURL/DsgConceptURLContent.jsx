import BaseURLContent from '@/components/kb/nav/appInfo/baseURL/BaseURLContent'

import CONFIG from '@/lib/config'
const { DESCRIPTION, FIELD_LABEL } = CONFIG.APP_INFO.DSG_CONCEPT

const DsgConceptURLContent = () => {
  return <BaseURLContent description={DESCRIPTION} fieldLabel={FIELD_LABEL} modalDataValueKey='selectedDsgConceptUrl' />
}

export default DsgConceptURLContent
