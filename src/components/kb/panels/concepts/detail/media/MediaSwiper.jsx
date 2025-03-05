import { use, useEffect, useRef } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import { Pagination, Navigation } from 'swiper/modules'

import MediaSwiperSlide from './MediaSwiperSlide'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import './mediaSwiper.css'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { CONCEPT_STATE } from '@/lib/kb/concept/state/conceptState'

const MediaSwiper = ({ height, slidesPerView = 3, showNavigation = false }) => {
  const { concept, editingState, modifyConcept } = use(ConceptContext)
  const swiperRef = useRef(null)

  const { media: editingMedia, mediaIndex: editingMediaIndex } = editingState

  const pagination = {
    clickable: true,
    renderBullet: (index, className) => {
      return '<span class="' + className + '">' + (index + 1) + '</span>'
    },
  }

  const handleSlideChange = change => {
    modifyConcept({
      type: CONCEPT_STATE.FIELD.SET,
      update: { field: 'mediaIndex', value: change.snapIndex },
    })
  }

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(editingMediaIndex)
    }
  }, [concept, editingMediaIndex])

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
