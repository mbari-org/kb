import ActionsAlert from './ActionsAlert'
import CONFIG from '@/lib/config'

const STAGED = CONFIG.PANELS.CONCEPTS.MODALS.STAGED

const DiscardingAlert = () => <ActionsAlert lines={STAGED.WARNING} severity='warning' />

export default DiscardingAlert
