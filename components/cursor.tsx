"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function Cursor() {
  const [isAtBottom, setIsAtBottom] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0])

  useEffect(() => {
    const checkIfBottom = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      
      const buffer = 20 // pixels from bottom to trigger
      const isBottom = windowHeight + scrollTop >= documentHeight - buffer
      
      setIsAtBottom(isBottom)
    }

    window.addEventListener('scroll', checkIfBottom)
    return () => window.removeEventListener('scroll', checkIfBottom)
  }, [])

  if (typeof window !== 'undefined' && window.innerWidth > 768) {
    return null
  }

  return (
    <motion.div 
      className="cursor-container"
      style={{ opacity }}
      animate={{ display: isAtBottom ? 'none' : 'block' }}
    >
      <div className="cursor-bounce">
        <div className="cursor-dot">
          <motion.div
            className="cursor-ring"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
