import { useEffect, useRef, useState } from 'react'
import { Backdrop, CircularProgress, useTheme } from '@mui/material'

const LOADING_DELAY = 333

const KbLoading = ({ loading }) => {
  const timerRef = useRef(undefined)
  const [active, setActive] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    if (loading) {
      timerRef.current = setTimeout(() => {
        setActive(true)
      }, LOADING_DELAY)
    } else {
      clearTimeout(timerRef.current)
      setActive(false)
    }
  }, [loading])

  return (
    <Backdrop
      sx={{
        color: theme.palette.primary.main,
        zIndex: theme.zIndex.drawer + 1,
      }}
      open={active}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
  )
}
export default KbLoading
