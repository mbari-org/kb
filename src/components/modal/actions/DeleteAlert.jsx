import ActionsAlert from './ActionsAlert'

const DeleteAlert = () => (
  <ActionsAlert
    line1='Deleting a concept is final.'
    line2='Please confirm you want to delete this concept.'
    severity='warning'
  />
)

export default DeleteAlert
