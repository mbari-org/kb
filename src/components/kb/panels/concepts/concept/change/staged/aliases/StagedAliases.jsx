import { Box } from '@mui/material'

import StagedAlias from './StagedAlias'
import StagedGroup from '@/components/kb/panels/concepts/concept/change/staged/StagedGroup'

import { stagedAliases } from '@/lib/kb/model/alias'

import { resettingItem } from '@/components/kb/panels/concepts/concept/change/staged/reset'
import { RESETTING } from '@/lib/constants'

const { EXTENT, GROUP } = RESETTING

const StagedAliases = ({ stagedEdit }) => {
  const [_, aliases] = stagedEdit

  return (
    <StagedGroup group={GROUP.ALIASES} initial={aliases.initial}>
      <Box>
        {stagedAliases(aliases).map(stagedAlias => {
          const { index } = stagedAlias
          const initialAlias = aliases.initial?.[index]
          return (
            <StagedAlias
              key={`alias-${index}`}
              initialAlias={initialAlias}
              stagedAlias={stagedAlias}
            />
          )
        })}
      </Box>
    </StagedGroup>
  )
}

export default StagedAliases
