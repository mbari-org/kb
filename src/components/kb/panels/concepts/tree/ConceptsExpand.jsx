import Collapse from '@mui/material/Collapse'
import { animated, useSpring } from '@react-spring/web'

const ConceptsExpand = props => {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 35}px,0,0)`,
    },
  })

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  )
}

export default ConceptsExpand
