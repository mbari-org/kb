import { use } from 'react'

import { useSwiper } from 'swiper/react'
import { useTheme } from '@mui/material/styles'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { isPendingMedia } from '@/lib/concept/state/media'
import { stagedBorder } from '@/lib/concept/state/staged'

import { PENDING } from '@/lib/constants/pending.js'
import { getMediaType } from '@/lib/model/media'
import { MEDIA } from '@/lib/constants'

const { IMAGE, VIDEO, ICON } = MEDIA.TYPE

const MediaSwiperSlide = ({ mediaIndex, mediaItem, showControls = false }) => {
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
      case VIDEO:
        return (
          <video
            controls={showControls}
            onClick={() => slideClick(mediaIndex)}
            src={mediaUrl}
            style={{ border, height: 'auto', width: '100%' }}
          />
        )
      case ICON:
        return (
          <img
            onClick={() => slideClick(mediaIndex)}
            src={mediaUrl}
            style={{ border, height: 'auto', width: '50%' }}
          />
        )
      case IMAGE:
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
