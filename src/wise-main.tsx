import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
/* Workaround: framing the live Framer case study instead of the coded one.
   To restore, render <WiseCaseStudy /> instead — that component and its
   stylesheet are still in the repo, untouched. */
import { FramerEmbed } from './FramerEmbed.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FramerEmbed
      url="https://shreyabhardwaj.framer.website/wise-case-study#wise-case-study-scroll"
      name="Wise"
    />
  </StrictMode>,
)
