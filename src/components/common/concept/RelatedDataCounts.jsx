import { use } from 'react'
import { Box, Typography } from '@mui/material'

import UserContext from '@/contexts/user/UserContext'

import CONFIG from '@/text'

const { NON_ADMIN_MESSAGE } = CONFIG.PANELS.CONCEPTS.MODALS.STRUCTURE.CHANGE_NAME

import { isAdmin } from '@/lib/auth/role'

const RelatedDataCounts = ({ relatedDataCounts }) => {
  const { user } = use(UserContext)
  const isAdminUser = isAdmin(user)

  if (!relatedDataCounts) return null

  const hasRelatedData = relatedDataCounts.some(count => count.value > 0)

  if (!hasRelatedData) return null

  const groupedByType = relatedDataCounts.reduce((acc, count) => {
    if (!acc[count.type]) acc[count.type] = []
    acc[count.type].push(count)
    return acc
  }, {})

  const renderSection = (type, counts) => {
    return (
    <Box key={type} >
      <Typography sx={{
        fontSize: theme => theme.typography.fontSize * 1.2,
        fontWeight: 'bold', ml: 1 }}>
        {`${type}:`}
      </Typography>
      <Box sx={{ ml: 4 }}>
        <Box sx={{ mb: 1 }}>
          {counts.map((count, index) => (
            <Typography
              key={`${type}-${index}`}
              sx={count.value > 0 ? { fontStyle: 'italic', fontWeight: 'bold' } : {}}
            >
              {`${count.title}: ${count.value} `}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
    )}

  return (
    <Box sx={{ mt: 1 }}>
      {Object.entries(groupedByType).map(([type, counts]) => renderSection(type, counts))}
      {!isAdminUser && (
        <Box sx={{ alignItems: 'center', mt: 2 }}>
          <Typography color='text.secondary' sx={{ textAlign: 'center' }}>
            {NON_ADMIN_MESSAGE.COMMUNICATE}
          </Typography>
          <Typography color='text.secondary' sx={{ textAlign: 'center' }}>
            {NON_ADMIN_MESSAGE.APPROVAL}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default RelatedDataCounts
