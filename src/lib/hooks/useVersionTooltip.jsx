import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useMemo } from 'react'

import {
  getBranchName,
  getBuildDate,
  getCommitDate,
  getCommitMessage,
  getVersion,
  isDirty,
} from '@/version'

/**
 * Hook that returns a tooltip component with detailed version information
 * @returns {JSX.Element} A Box component containing version details for use in tooltips
 */
const useVersionTooltip = () => {
  const theme = useTheme()

  return useMemo(() => {
    const version = getVersion()
    const buildDate = getBuildDate()
    const branchName = getBranchName()
    const commitDate = getCommitDate()
    const commitMessage = getCommitMessage()
    const dirty = isDirty()

    const formatDate = dateString => {
      try {
        return new Date(dateString).toLocaleString()
      } catch {
        return dateString
      }
    }

    return (
      <Box
        sx={{
          minWidth: 300,
          p: 1.5,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>Version:</strong>
          </Typography>
          <Typography variant='body2'>{version}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>Commit:</strong>
          </Typography>
          <Typography variant='body2'>{formatDate(commitDate)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>Message:</strong>
          </Typography>
          <Typography variant='body2' sx={{ wordBreak: 'break-word' }}>
            {commitMessage}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>Build:</strong>
          </Typography>
          <Typography variant='body2'>{formatDate(buildDate)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>Branch:</strong>
          </Typography>
          <Typography variant='body2'>{branchName}</Typography>
        </Box>
        {dirty && (
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
              <strong>Status:</strong>
            </Typography>
            <Typography variant='body2' sx={{ color: theme.palette.primary.edit }}>
              Working directory has uncommitted changes
            </Typography>
          </Box>
        )}
      </Box>
    )
  }, [theme.palette.primary.edit])
}

export default useVersionTooltip
