import { FormControlLabel, Radio, Stack } from '@mui/material'
import { LABELS } from '@/lib/constants'
import { use } from 'react'
import AuthContext from '@/contexts/auth/AuthContext'
import { isAdmin } from '@/lib/auth/role'

const { NAME_ONLY, ASSOCIATED_DATA } = LABELS.CONCEPT.CHANGE_NAME

const NameChangeExtent = ({ nameChangeType, onChange }) => {
  const { user } = use(AuthContext)
  const isUserAdmin = isAdmin(user)

  return (
    <Stack direction='row'>
      <FormControlLabel
        control={
          <Radio
            name='nameChangeType'
            value={NAME_ONLY}
            checked={nameChangeType === NAME_ONLY}
            onChange={onChange}
            disabled={!isUserAdmin}
          />
        }
        label={NAME_ONLY}
      />
      <FormControlLabel
        control={
          <Radio
            name='nameChangeType'
            value={ASSOCIATED_DATA}
            checked={nameChangeType === ASSOCIATED_DATA}
            onChange={onChange}
            disabled={!isUserAdmin}
          />
        }
        label={ASSOCIATED_DATA}
      />
    </Stack>
  )
}

NameChangeExtent.defaultProps = {
  nameChangeType: null,
}

export default NameChangeExtent
