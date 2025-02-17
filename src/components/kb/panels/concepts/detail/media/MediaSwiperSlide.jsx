import { useSwiper } from 'swiper/react'
import { useTheme } from '@mui/material/styles'

import { CONCEPT } from '@/contexts/concept/lib/conceptStateReducer'

import { mediaBorder } from '@/lib/kb/concept/media'

const MediaSwiperSlide = ({ mediaIndex, mediaItem }) => {
  const theme = useTheme()

  const swiper = useSwiper()

  const slideClick = mediaIndex => swiper.slideTo(mediaIndex)

  const border = mediaIndex.action === CONCEPT.NONE ? 'none' : mediaBorder(mediaItem, theme)

  return (
    <img
      onClick={() => slideClick(mediaIndex)}
      src={mediaItem.url}
      style={{ border, height: 'auto', width: '100%' }}
    />
  )
}

export default MediaSwiperSlide
