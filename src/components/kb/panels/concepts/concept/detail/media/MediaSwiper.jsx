import { use, useEffect, useRef } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import { Pagination, Navigation } from 'swiper/modules'

import MediaSwiperSlide from './swiper/MediaSwiperSlide'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import './swiper/mediaSwiper.css'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { CONCEPT_STATE } from '@/lib/constants'

const MediaSwiper = ({ height, slidesPerView = 3, showNavigation = false }) => {
  const { concept, stagedState, modifyConcept } = use(ConceptContext)
  const swiperRef = useRef(null)

  const { media: editingMedia, mediaIndex: editingMediaIndex } = stagedState

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
