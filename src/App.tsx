import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { lazy, Suspense } from 'react'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import { ServiceProvider } from './lib/service-context'

const Impressum = lazy(() => import('./pages/Impressum'))
const Datenschutz = lazy(() => import('./pages/Datenschutz'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const location = useLocation()
  return (
    <MotionConfig reducedMotion="user">
      <ServiceProvider>
        <Layout>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Suspense fallback={<div className="min-h-[70vh]" aria-busy="true" />}>
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/impressum" element={<Impressum />} />
                  <Route path="/datenschutz" element={<Datenschutz />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </Layout>
      </ServiceProvider>
    </MotionConfig>
  )
}
