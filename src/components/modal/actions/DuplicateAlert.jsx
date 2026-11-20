import ActionsAlert from './ActionsAlert'

import CONFIG from '@/lib/config'

const DuplicateAlert = () => (
  <ActionsAlert lines={CONFIG.UI.ACTION_ALERT.DUPLICATE} severity='error' />
)

export default DuplicateAlert
