import { useSwiper } from 'swiper/react'
import { useTheme } from '@mui/material/styles'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

import { fieldBorder } from '@/lib/kb/conceptState/field'

const MediaSwiperSlide = ({ mediaIndex, mediaItem }) => {
  const theme = useTheme()

  const swiper = useSwiper()

  const slideClick = mediaIndex => swiper.slideTo(mediaIndex)

  const border = fieldBorder(CONCEPT_STATE.MEDIA, mediaItem, theme, '2px', theme.palette.grey[300])

  return (
    <img
      onClick={() => slideClick(mediaIndex)}
      src={mediaItem.url}
      style={{ border, height: 'auto', width: '100%' }}
    />
  )
}

export default MediaSwiperSlide
