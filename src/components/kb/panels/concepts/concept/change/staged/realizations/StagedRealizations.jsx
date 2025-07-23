import { Box } from '@mui/material'

import StagedItems from '@/components/kb/panels/concepts/concept/change/staged/StagedItems'
import StagedRealization from '@/components/kb/panels/concepts/concept/change/staged/realizations/StagedRealization'

import { stagedRealizations } from '@/lib/kb/model/realization'

import { resettingItem } from '@/components/kb/panels/concepts/concept/change/staged/reset'
import { RESETTING } from '@/lib/constants'

const { EXTENT, GROUP } = RESETTING

const StagedRealizations = ({ confirmReset, stagedEdit }) => {
  const [_, realizations] = stagedEdit

  return (
    <StagedItems group={GROUP.REALIZATIONS} initial={realizations.initial}>
      <Box>
        {stagedRealizations(realizations).map(stagedRealization => {
          const { index } = stagedRealization
          const initialRealization = realizations.initial?.[index]
          const itemDisabled =
            resettingItem(confirmReset, GROUP.REALIZATIONS, index) === EXTENT.OTHER
          return (
            <StagedRealization
              key={`realization-${index}`}
              disabled={itemDisabled}
              initialRealization={initialRealization}
              stagedRealization={stagedRealization}
            />
          )
        })}
      </Box>
    </StagedItems>
  )
}

export default StagedRealizations
