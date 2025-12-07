import { use, useEffect, useRef } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import { Pagination, Navigation } from 'swiper/modules'

import MediaSwiperSlide from './swiper/MediaSwiperSlide'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import './swiper/mediaSwiper.css'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'

const { MEDIA_ITEM } = CONCEPT_STATE

const MediaSwiper = ({ height, slidesPerView = 3, showNavigation = false }) => {
  const { stagedState, modifyConcept } = use(ConceptContext)
  const swiperRef = useRef(null)
  const isProgrammaticChange = useRef(false)

  const { media: editingMedia, mediaIndex: editingMediaIndex } = stagedState

  const pagination = {
    clickable: true,
    renderBullet: (index, className) => {
      return '<span class="' + className + '">' + (index + 1) + '</span>'
    },
  }

  const handleSlideChange = change => {
    // Only update state if this is not a programmatic change
    if (!isProgrammaticChange.current) {
      modifyConcept({
        type: MEDIA_ITEM.INDEX,
        update: { field: 'mediaIndex', value: change.snapIndex },
      })
    }
  }

  // Sync swiper position with external state changes (e.g., from other components)
  // The isProgrammaticChange flag prevents infinite loops by blocking state updates
  // when the swiper position is changed programmatically
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.activeIndex !== editingMediaIndex) {
      isProgrammaticChange.current = true
      swiperRef.current.slideTo(editingMediaIndex)
      // Reset the flag after a short delay to allow the slide change to complete
      setTimeout(() => {
        isProgrammaticChange.current = false
      }, 100)
    }
  }, [editingMediaIndex])

  return (
    <Swiper
      centeredSlides={true}
      initialSlide={editingMediaIndex}
      modules={[Pagination, ...(showNavigation ? [Navigation] : [])]}
      navigation={showNavigation}
      onSlideChange={handleSlideChange}
      onSwiper={swiper => {
        swiperRef.current = swiper
      }}
      pagination={pagination}
      slidesPerView={slidesPerView}
      style={{
        height,
        overflow: 'hidden',
      }}
    >
      {editingMedia.map((mediaItem, mediaIndex) => (
        <SwiperSlide key={`concept-media-slide-${mediaIndex}`}>
          <MediaSwiperSlide mediaIndex={mediaIndex} mediaItem={mediaItem} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default MediaSwiper
