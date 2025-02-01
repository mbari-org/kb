import { use } from "react"

import { Swiper, SwiperSlide } from "swiper/react"

import { Pagination } from "swiper/modules"

import MediaSwiperSlide from "./MediaSwiperSlide"

import "swiper/css"
import "swiper/css/pagination"

import "./mediaSwiper.css"

import ConceptContext from "@/contexts/concept/ConceptContext"

const MediaSwiper = ({ height, setMediaIndex }) => {
  const { editingState } = use(ConceptContext)

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>"
    },
  }

  return (
    <Swiper
      centeredSlides={true}
      initialSlide={0}
      modules={[Pagination]}
      onSlideChange={change => setMediaIndex(change.snapIndex)}
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
