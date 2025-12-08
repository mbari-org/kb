import ActionsAlert from './ActionsAlert'
import { CONFIG } from '@/config/js/index.js'

const STAGED = CONFIG.PANELS.CONCEPTS.MODALS.STAGED

const DiscardingAlert = () => (
  <ActionsAlert
    line1={STAGED.WARNING.LINE_1}
    line2={STAGED.WARNING.LINE_2}
    severity='warning'
  />
)

export default DiscardingAlert
