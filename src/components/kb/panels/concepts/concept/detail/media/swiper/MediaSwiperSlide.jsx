import { use } from 'react'

import { useSwiper } from 'swiper/react'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { HISTORY_FIELD, PENDING } from '@/lib/constants'

import { stagedBorder } from '@/lib/kb/state/staged'
import { fieldPending } from '@/lib/kb/model/history'

const MediaSwiperSlide = ({ mediaIndex, mediaItem }) => {
  const theme = useTheme()

  const { pending } = use(ConceptContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)

  const mediaPendingArray = fieldPending(pendingConcept, HISTORY_FIELD.MEDIA)
  const mediaPending = mediaPendingArray[mediaPendingArray.length - 1]

  const swiper = useSwiper()

  const slideClick = mediaIndex => swiper.slideTo(mediaIndex)

  const border = stagedBorder({
    itemPending: mediaPending,
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
