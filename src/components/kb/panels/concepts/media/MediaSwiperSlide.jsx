import { useSwiper } from "swiper/react"
import { useTheme } from "@mui/material/styles"

const MediaSwiperSlide = ({ index, slide }) => {
  const theme = useTheme()

  const swiper = useSwiper()

  const slideClick = index => swiper.slideTo(index)

  const hasPending = slide.action !== "None"
  const slideBorder = hasPending
    ? `2px solid ${theme.palette.primary.cancel}`
    : "none"

  return (
    <img
      onClick={() => slideClick(index)}
      src={slide.url}
      style={{ border: slideBorder, height: "auto", width: "100%" }}
    />
  )
}

export default MediaSwiperSlide
