import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useMemo } from 'react'

import CONFIG from '@/lib/config'

import {
  getBranchName,
  getBuildDate,
  getCommitDate,
  getCommitHash,
  getCommitMessage,
  getVersion,
  isDirty,
} from '@/version'

const { BRANCH, BUILD, COMMIT, DATE, DIRTY, MESSAGE, STATUS, TITLE } = CONFIG.UI.VERSION

const TOOLTIP_MIN_WIDTH = 300

/**
 * Hook that returns a tooltip component with detailed version information
 * @returns {JSX.Element} A Box component containing version details for use in tooltips
 */
const useVersionTooltip = () => {
  const theme = useTheme()

  return useMemo(() => {
    const branchName = getBranchName()
    const buildDate = getBuildDate()
    const commitDate = getCommitDate()
    const commitHash = getCommitHash()
    const commitMessage = getCommitMessage()
    const dirty = isDirty()
    const version = getVersion()

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
          minWidth: TOOLTIP_MIN_WIDTH,
          p: 1.5,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>{TITLE}</strong>
          </Typography>
          <Typography variant='body2'>{version}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>{COMMIT}</strong>
          </Typography>
          <Typography variant='body2'>{commitHash}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>{DATE}</strong>
          </Typography>
          <Typography variant='body2'>{formatDate(commitDate)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>{MESSAGE}</strong>
          </Typography>
          <Typography variant='body2' sx={{ wordBreak: 'break-word' }}>
            {commitMessage}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>{BUILD}</strong>
          </Typography>
          <Typography variant='body2'>{formatDate(buildDate)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
            <strong>{BRANCH}</strong>
          </Typography>
          <Typography variant='body2'>{branchName}</Typography>
        </Box>
        {dirty && (
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Typography variant='body2' sx={{ width: 100, flexShrink: 0 }}>
              <strong>{STATUS}</strong>
            </Typography>
            <Typography variant='body2' sx={{ color: theme.palette.primary.edit }}>
              {DIRTY}
            </Typography>
          </Box>
        )}
      </Box>
    )
  }, [theme.palette.primary.edit])
}

export default useVersionTooltip
