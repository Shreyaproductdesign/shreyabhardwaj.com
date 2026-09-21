import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/* Content that reveals on scroll is born hidden, so the flag has to be on the
   document before React paints. Set from an effect it landed a frame late, and
   every section below the fold flashed visible and then animated out. Skipped
   under reduced motion, where nothing is hidden in the first place, and never
   set without JavaScript, so the page degrades to plain content. */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reveal-ready')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
