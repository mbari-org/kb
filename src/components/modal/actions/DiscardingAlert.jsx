import ActionsAlert from './ActionsAlert'
import { MODALS } from '@/config/js/panels/concepts/modals.js'

const STAGED = MODALS.STAGED

const DiscardingAlert = () => (
  <ActionsAlert
    line1={STAGED.WARNING.LINE_1}
    line2={STAGED.WARNING.LINE_2}
    severity='warning'
  />
)

export default DiscardingAlert
