import { motion, type HTMLMotionProps } from 'motion/react'

interface Props extends HTMLMotionProps<'div'> {
  delay?: number
  y?: number
}

/** Sanftes Einblenden beim Scrollen. Respektiert prefers-reduced-motion über MotionConfig. */
export default function Reveal({ delay = 0, y = 24, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
