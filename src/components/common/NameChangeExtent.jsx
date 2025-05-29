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
            checked={nameChangeType === NAME_ONLY}
            disabled={!isUserAdmin}
            name='nameChangeType'
            onChange={onChange}
            value={NAME_ONLY}
          />
        }
        label={NAME_ONLY}
      />
      <FormControlLabel
        control={
          <Radio
            checked={nameChangeType === ASSOCIATED_DATA}
            disabled={!isUserAdmin}
            name='nameChangeType'
            onChange={onChange}
            value={ASSOCIATED_DATA}
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
