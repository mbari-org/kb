import ActionsAlert from '@/components/modal/actions/ActionsAlert'

import CONFIG from '@/lib/config'

const { OUTCOME_UNKNOWN } = CONFIG.PANELS.CONCEPTS.MODALS.STAGED

const SaveOutcomeUnknownContent = () => <ActionsAlert lines={OUTCOME_UNKNOWN} severity='warning' />

export default SaveOutcomeUnknownContent
