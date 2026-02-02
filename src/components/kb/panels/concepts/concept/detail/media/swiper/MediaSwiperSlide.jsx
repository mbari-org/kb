import { use } from 'react'

import { useSwiper } from 'swiper/react'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { isPendingMedia } from '@/lib/concept/state/media'
import { stagedBorder } from '@/lib/concept/state/staged'

import { PENDING } from '@/lib/constants/pending.js'
import { getMediaType, MEDIA_TYPES } from '@/lib/model/media'

const MediaSwiperSlide = ({ mediaIndex, mediaItem }) => {
  const theme = useTheme()

  const { pending } = use(ConceptContext)

  const pendingConcept = pending(PENDING.DATA.CONCEPT)

  const swiper = useSwiper()

  const slideClick = mediaIndex => swiper.slideTo(mediaIndex)

  const pendingMedia = pendingConcept.filter(isPendingMedia)
  const border = stagedBorder({
    itemPending: pendingMedia,
    noActionBorderColor: theme.palette.grey[300],
    stagedItem: mediaItem,
    theme,
    width: '2px',
  })

  const mediaUrl = mediaItem?.url
  const mediaType = mediaUrl ? getMediaType(mediaUrl) : null

  const renderMedia = () => {
    if (!mediaUrl) return null

    switch (mediaType) {
      case MEDIA_TYPES.VIDEO:
        return (
          <video
            onClick={() => slideClick(mediaIndex)}
            src={mediaUrl}
            style={{ border, height: 'auto', width: '100%' }}
          />
        )
      case MEDIA_TYPES.ICON:
        return (
          <img
            onClick={() => slideClick(mediaIndex)}
            src={mediaUrl}
            style={{ border, height: 'auto', width: '50%' }}
          />
        )
      case MEDIA_TYPES.IMAGE:
      default:
        return (
          <img
            onClick={() => slideClick(mediaIndex)}
            src={mediaUrl}
            style={{ border, height: 'auto', width: '100%' }}
          />
        )
    }
  }

  return renderMedia()
}

export default MediaSwiperSlide
