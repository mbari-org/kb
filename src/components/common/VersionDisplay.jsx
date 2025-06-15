import { useState } from 'react'
import { MdRefresh } from 'react-icons/md'
import { IoInformationCircleOutline } from 'react-icons/io5'

import { Typography, Box, Tooltip, IconButton } from '@mui/material'
import { grey } from '@mui/material/colors'

import { getBranchName, getBuildDate, getCommitDate, getVersion, isDirty } from '@/lib/version'

/**
 * VersionDisplay component - shows application version info
 *
 * @param {Object} props
 * @param {string} props.variant - Typography variant (default: 'caption')
 * @param {'text'|'icon'} props.display - Display mode (default: 'text')
 * @param {string} props.color - Text color (default: grey[300])
 *
 * Note: Tooltip is automatically shown when current branch is not 'main'
 */
const VersionDisplay = ({ color = grey[300], display = 'text', variant = 'caption' }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const version = getVersion()
  const buildDate = getBuildDate()
  const branchName = getBranchName()
  const commitDate = getCommitDate()
  const dirty = isDirty()

  const isDev = import.meta.env.DEV

  const handleRefreshVersion = async () => {
    if (!isDev || isRefreshing) return

    setIsRefreshing(true)
    try {
      const response = await fetch('/api/regenerate-version', {
        method: 'POST',
      })
      const result = await response.json()

      if (result.success) {
        console.log('🔄 Version refreshed:', result.version)
      } else {
        console.error('❌ Failed to refresh version:', result.error)
      }
    } catch (error) {
      console.error('❌ Error refreshing version:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatDate = dateString => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  const devTooltip = (
    <Box
      sx={{
        minWidth: 300,
        bgcolor: grey[800],
        p: 1.5,
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography variant='body2' sx={{ width: 100, flexShrink: 0, color: grey[200] }}>
          <strong>Version:</strong>
        </Typography>
        <Typography variant='body2' sx={{ color: grey[200] }}>
          {version}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography variant='body2' sx={{ width: 100, flexShrink: 0, color: grey[200] }}>
          <strong>Commit:</strong>
        </Typography>
        <Typography variant='body2' sx={{ color: grey[200] }}>
          {formatDate(commitDate)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography variant='body2' sx={{ width: 100, flexShrink: 0, color: grey[200] }}>
          <strong>Build:</strong>
        </Typography>
        <Typography variant='body2' sx={{ color: grey[200] }}>
          {formatDate(buildDate)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography variant='body2' sx={{ width: 100, flexShrink: 0, color: grey[200] }}>
          <strong>Branch:</strong>
        </Typography>
        <Typography variant='body2' sx={{ color: grey[200] }}>
          {branchName}
        </Typography>
      </Box>
      {dirty && (
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant='body2' sx={{ width: 100, flexShrink: 0, color: grey[200] }}>
            <strong>Status:</strong>
          </Typography>
          <Typography variant='body2' color='warning.main'>
            Working directory has uncommitted changes
          </Typography>
        </Box>
      )}
    </Box>
  )

  const renderContent = () => {
    if (display === 'icon') {
      return (
        <IconButton
          size='small'
          sx={{
            color: color,
            width: 20,
            height: 20,
            p: 0,
            m: 0,
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <IoInformationCircleOutline size={24} />
        </IconButton>
      )
    }

    return (
      <Box
        display='flex'
        alignItems='center'
        gap={0.5}
        sx={{
          '&:hover .refresh-button': {
            opacity: isDev ? 1 : 0,
          },
        }}
      >
        <Typography variant={variant} color={dirty ? 'warning.main' : color}>
          v{version}
        </Typography>
        {isDev && (
          <IconButton
            className='refresh-button'
            size='small'
            onClick={handleRefreshVersion}
            disabled={isRefreshing}
            sx={{
              opacity: 0,
              transition: 'opacity 0.2s',
              color: color,
              width: 16,
              height: 16,
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <MdRefresh size={12} />
          </IconButton>
        )}
      </Box>
    )
  }

  const content = renderContent()

  if (isDev || display === 'icon') {
    return (
      <Tooltip
        title={devTooltip}
        arrow
        placement='top'
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: grey[800],
              p: 0,
              '& .MuiTooltip-arrow': {
                color: grey[800],
              },
            },
          },
        }}
      >
        <Box component='span'>{content}</Box>
      </Tooltip>
    )
  }

  return content
}

export default VersionDisplay
