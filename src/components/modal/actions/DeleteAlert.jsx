import ActionsAlert from './ActionsAlert'

import CONFIG from '@/lib/config'

const DeleteAlert = () => (
  <ActionsAlert lines={CONFIG.UI.ACTION_ALERT.DELETE} severity='warning' />
)

export default DeleteAlert
