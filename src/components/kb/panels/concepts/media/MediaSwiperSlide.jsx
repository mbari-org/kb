import { useSwiper } from "swiper/react"

const MediaSwiperSlide = ({ index, slide }) => {
  const swiper = useSwiper()

  const slideClick = index => swiper.slideTo(index)

  return (
    <img
      onClick={() => slideClick(index)}
      src={slide.url}
      style={{ height: "auto", width: "100%" }}
    />
  )
}

export default MediaSwiperSlide
