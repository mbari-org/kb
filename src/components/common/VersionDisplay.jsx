import { useState, use } from 'react'
import { useTheme } from '@mui/material/styles'
import { useErrorBoundary } from 'react-error-boundary'
import { MdRefresh } from 'react-icons/md'
import { IoInformationCircleOutline } from 'react-icons/io5'

import { Typography, Box, IconButton } from '@mui/material'

import KBTooltip from '@/components/common/KBTooltip'
import ConfigContext from '@/contexts/config/ConfigContext'
import useVersionTooltip from '@/lib/hooks/useVersionTooltip'

import { getVersion, isDirty } from '@/version'

const VersionDisplay = ({ color = 'grey.300', display = 'text', variant = 'caption' }) => {
  const { showBoundary } = useErrorBoundary()
  const theme = useTheme()
  const { isDev } = use(ConfigContext)

  const [isRefreshing, setIsRefreshing] = useState(false)

  const dirty = isDirty()
  const dirtyColor = dirty ? theme.palette.primary.edit : color
  const version = getVersion()
  const devTooltip = useVersionTooltip()

  const handleRefreshVersion = async () => {
    if (!isDev || isRefreshing) return

    setIsRefreshing(true)
    try {
      const response = await fetch('/api/regenerate-version', {
        method: 'POST',
      })
      const result = await response.json()

      if (!result.success) {
        throw new Error(`Failed to refresh version: ${result.error}`)
      }
    } catch (error) {
      showBoundary(error)
    } finally {
      setIsRefreshing(false)
    }
  }

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
              color: color,
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
          color: dirtyColor,
          '&:hover .refresh-button': {
            opacity: isDev ? 1 : 0,
          },
        }}
      >
        <Typography variant={variant}>v{version}</Typography>
        {isDev && (
          <IconButton
            className='refresh-button'
            size='small'
            onClick={handleRefreshVersion}
            disabled={isRefreshing}
            sx={{
              opacity: 0,
              transition: 'opacity 0.2s',
              width: 16,
              height: 16,
              '&:hover': {
                color: dirtyColor,
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
      <KBTooltip title={devTooltip} arrow placement='top'>
        <Box component='span'>{content}</Box>
      </KBTooltip>
    )
  }

  return content
}

export default VersionDisplay
