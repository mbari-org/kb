import { use, useEffect, useRef } from "react"

import { Swiper, SwiperSlide } from "swiper/react"

import { Pagination } from "swiper/modules"

import MediaSwiperSlide from "./MediaSwiperSlide"

import "swiper/css"
import "swiper/css/pagination"

import "./mediaSwiper.css"

import ConceptContext from "@/contexts/concept/ConceptContext"

const MediaSwiper = ({ height, setMediaIndex }) => {
  const { concept, editingState } = use(ConceptContext)
  const swiperRef = useRef(null)

  const pagination = {
    clickable: true,
    renderBullet: (index, className) => {
      return '<span class="' + className + '">' + (index + 1) + "</span>"
    },
  }

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(editingState.mediaIndex)
    }
  }, [concept, editingState.mediaIndex])

  return (
    <Swiper
      centeredSlides={true}
      initialSlide={editingState.mediaIndex}
      modules={[Pagination]}
      onSlideChange={change => setMediaIndex(change.snapIndex)}
      onSwiper={swiper => {
        swiperRef.current = swiper
      }}
      pagination={pagination}
      slidesPerView={3}
      style={{
        height,
        overflow: "hidden",
      }}
    >
      {editingState.media.map((mediaItem, mediaIndex) => (
        <SwiperSlide key={`concept-media-${mediaIndex}`}>
          <MediaSwiperSlide mediaIndex={mediaIndex} mediaItem={mediaItem} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default MediaSwiper
