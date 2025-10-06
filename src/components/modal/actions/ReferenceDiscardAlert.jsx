import ActionsAlert from './ActionsAlert'

const ReferenceDiscardAlert = () => (
  <ActionsAlert
    line1='Discarding reference edits is final.'
    line2='Please confirm you want to discard the changes.'
    severity='warning'
  />
)

export default ReferenceDiscardAlert