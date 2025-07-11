import ActionsAlert from './ActionsAlert'

const DiscardingAlert = () => (
  <ActionsAlert
    line1='Discarding edits is final.'
    line2='Please confirm you want to discard the indicated edits.'
    severity='warning'
  />
)

export default DiscardingAlert
