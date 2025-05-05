import { use } from 'react'

import { useSwiper } from 'swiper/react'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { fieldBorder } from '@/lib/kb/model/field'
import { fieldPendingHistory } from '@/lib/kb/model/history'

const MediaSwiperSlide = ({ mediaIndex, mediaItem }) => {
  const theme = useTheme()

  const { pendingHistory } = use(ConceptContext)

  const mediaPendingHistory = fieldPendingHistory(pendingHistory, 'Media')

  const swiper = useSwiper()

  const slideClick = mediaIndex => swiper.slideTo(mediaIndex)

  const border = fieldBorder({
    itemPendingHistory: mediaPendingHistory,
    noActionBorderColor: theme.palette.grey[300],
    stagedItem: mediaItem,
    theme,
    width: '2px',
  })

  return (
    <img
      onClick={() => slideClick(mediaIndex)}
      src={mediaItem.url}
      style={{ border, height: 'auto', width: '100%' }}
    />
  )
}

export default MediaSwiperSlide
