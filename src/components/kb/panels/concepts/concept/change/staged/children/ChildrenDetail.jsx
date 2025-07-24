import { use } from 'react'
import { Box, Typography } from '@mui/material'

import ChildAdd from './ChildAdd'
import ChildrenReset from './ChildrenReset'

import { fieldSx } from '@/components/common/format'

import { RESETTING } from '@/lib/constants'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const { RESET } = CONCEPT_STATE

const ChildrenDetail = ({ edit }) => {
  const [_, children] = edit

  const { confirmReset } = use(ConceptContext)

  const changingChild = index => {
    if (!confirmReset) return RESETTING.EXTENT.NONE
    if (confirmReset.type === RESET.CHILDREN) return RESETTING.EXTENT.ME
    if (confirmReset.type === RESET.CHILD && confirmReset.index === index)
      return RESETTING.EXTENT.ME
    if (confirmReset.type === RESET.TO_INITIAL) return RESETTING.EXTENT.ME
    return RESETTING.EXTENT.OTHER
  }

  const childrenSx =
    changingChild() === RESETTING.EXTENT.OTHER ? { ...fieldSx, color: 'text.disabled' } : fieldSx

  if (children.staged.length === 0) return null

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
            <ChildAdd key={`add-child-${name}`} child={child} changing={changingChild(index)} />
          )
        })}
      </Box>
    </Box>
  )
}

export default ChildrenDetail
