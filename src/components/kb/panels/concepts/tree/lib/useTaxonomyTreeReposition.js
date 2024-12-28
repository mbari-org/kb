import { use, useEffect, useRef } from "react"

import ModalContext from "@/contexts/modal/ModalContext"

const useTaxonomyTreeReposition = (apiRef, concept) => {
  const { loading } = use(ModalContext)

  const timeoutRef = useRef(null)

  const conceptName = concept?.name

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (loading) {
      return
    }

    // Scroll and focused item after a short delay to allow tree expansion
    timeoutRef.current = setTimeout(() => {
      const domElement = apiRef.current.getItemDOMElement(conceptName)
      if (!domElement) {
        return
      }
      const rect = domElement.getBoundingClientRect()
      const conceptIsVisible =
        rect.top >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight)
      if (!conceptIsVisible) {
        domElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
        apiRef.current.focusItem(null, conceptName)
      }
    }, 750)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [apiRef, conceptName, loading])
}

export default useTaxonomyTreeReposition
