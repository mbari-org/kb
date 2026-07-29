import ActionsAlert from './ActionsAlert'

const DuplicateAlert = () => (
  <ActionsAlert
    lines={['This realization already exists.', 'Please modify the values to create a unique realization.']}
    severity='error'
  />
)

export default DuplicateAlert
