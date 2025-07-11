import ActionsAlert from './ActionsAlert'

const DuplicateAlert = () => (
  <ActionsAlert
    line1='This realization already exists.'
    line2='Please modify the values to create a unique realization.'
    severity='error'
  />
)

export default DuplicateAlert
