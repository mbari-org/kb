import { use } from 'react'
import { Box, Typography } from '@mui/material'

import ChildAdd from './ChildAdd'
import ChildrenReset from './ChildrenReset'

import { fieldSx } from '@/components/common/format'

import { RESETTING } from '@/lib/constants'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/conceptState'

const { RESET } = CONCEPT_STATE

const ChildrenDetail = ({ edit }) => {
  const [_, children] = edit

  const { confirmDiscard } = use(ConceptContext)

  const resettingChild = index => {
    if (!confirmDiscard) return RESETTING.NONE
    if (confirmDiscard.type === RESET.ADD_CHILDREN) return RESETTING.ME
    if (confirmDiscard.type === RESET.ADD_CHILD && confirmDiscard.index === index)
      return RESETTING.ME
    if (confirmDiscard.type === RESET.TO_INITIAL) return RESETTING.ME
    return RESETTING.OTHER
  }

  const childrenSx =
    resettingChild() === RESETTING.OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ChildrenReset />
        <Typography sx={childrenSx}>Children</Typography>
      </Box>
      <Box sx={{ ml: 3 }}>
        {children.staged.map((child, index) => {
          const { name } = child
          return (
            <ChildAdd key={`add-child-${name}`} child={child} resetting={resettingChild(index)} />
          )
        })}
      </Box>
    </Box>
  )
}

export default ChildrenDetail
