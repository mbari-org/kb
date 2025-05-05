import { use } from 'react'

import { useSwiper } from 'swiper/react'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { fieldPendingHistory } from '@/lib/kb/model/pendingHistory'

import { CONCEPT_STATE } from '@/lib/kb/conceptState/state/conceptState'

import { fieldBorder } from '@/lib/kb/conceptState/field'

const MediaSwiperSlide = ({ mediaIndex, mediaItem }) => {
  const theme = useTheme()

  const { pendingHistory, stagedState } = use(ConceptContext)

  const mediaPendingHistory = fieldPendingHistory(pendingHistory, 'Media')

  const swiper = useSwiper()

  const slideClick = mediaIndex => swiper.slideTo(mediaIndex)

  const border = fieldBorder({
    itemPendingHistory: mediaPendingHistory,
    itemType: CONCEPT_STATE.MEDIA,
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
