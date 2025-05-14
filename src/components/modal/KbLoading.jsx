import { use, useEffect, useRef, useState } from 'react'
import { Backdrop, CircularProgress, Stack, Typography, useTheme } from '@mui/material'

import ModalContext from '@/contexts/modal/ModalContext'

import { PROCESSING } from '@/lib/constants'

const { LOADING_DELAY } = PROCESSING

const KbLoading = () => {
  const { processing } = use(ModalContext)

  const timerRef = useRef(undefined)
  const [active, setActive] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    if (processing) {
      timerRef.current = setTimeout(() => {
        setActive(true)
      }, LOADING_DELAY)
    } else {
      clearTimeout(timerRef.current)
      setActive(false)
    }
  }, [processing])

  if (!processing) {
    return null
  }

  return (
    <Backdrop
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        color: theme.palette.primary.main,
        zIndex: theme.zIndex.drawer + 2,
      }}
      open={active}
    >
      <Stack alignItems='center' direction='row' spacing={2}>
        <CircularProgress color='inherit' />
        <Typography variant='h3'>{processing}</Typography>
      </Stack>
    </Backdrop>
  )
}
export default KbLoading
