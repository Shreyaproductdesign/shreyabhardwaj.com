import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FramerEmbed } from './FramerEmbed.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FramerEmbed
      url="https://shreyabhardwaj.framer.website/quickfix-case-study"
      name="QuickFix"
    />
  </StrictMode>,
)
