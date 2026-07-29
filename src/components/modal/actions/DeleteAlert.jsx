import ActionsAlert from './ActionsAlert'

const DeleteAlert = () => (
  <ActionsAlert
    lines={['Deleting a concept is final.', 'Please confirm you want to delete this concept.']}
    severity='warning'
  />
)

export default DeleteAlert
