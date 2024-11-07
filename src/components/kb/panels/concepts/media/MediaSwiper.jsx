import { useTheme } from "@mui/material/styles"
import { Swiper, SwiperSlide } from "swiper/react"

import { Pagination } from "swiper/modules"

import MediaSwiperSlide from "./MediaSwiperSlide"

import "swiper/css"
import "swiper/css/pagination"

import "./mediaSwiper.css"

const MediaSwiper = ({ media, height, setMediaIndex }) => {
  const theme = useTheme()

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>"
    },
  }

  return (
    <>
      <Swiper
        centeredSlides={true}
        initialSlide={0}
        modules={[Pagination]}
        onSlideChange={change => setMediaIndex(change.snapIndex)}
        pagination={pagination}
        slidesPerView={3}
        spaceBetween={10}
        style={{
          border: `1px solid ${theme.palette.grey[300]}`,
          height,
          overflow: "hidden",
        }}
      >
        {media.map((slide, index) => (
          <SwiperSlide key={`concept-media-${index}`}>
            <MediaSwiperSlide index={index} slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default MediaSwiper
