import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import ChatScreen from './screens/ChatScreen.jsx'
import YouScreen from './screens/YouScreen.jsx'
import JourneyScreen from './screens/JourneyScreen.jsx'
import PatternsScreen from './screens/PatternsScreen.jsx'
import ReflectionView from './screens/ReflectionView.jsx'
import TagTimelineView from './screens/TagTimelineView.jsx'
import PatternView from './screens/PatternView.jsx'
import ComponentLibrary from './screens/ComponentLibrary.jsx'
import BrandGuide from './screens/BrandGuide.jsx'
import StoreScreens from './screens/StoreScreens.jsx'
import Onboarding from './screens/Onboarding.jsx'
import OnboardingV2 from './screens/OnboardingV2.jsx'
import OnboardingV3 from './screens/OnboardingV3.jsx'
import OnboardingV4 from './screens/OnboardingV4.jsx'
import OnboardingV5 from './screens/OnboardingV5.jsx'
import OnboardingV6 from './screens/OnboardingV6.jsx'
import OnboardingV7 from './screens/OnboardingV7.jsx'
import PaywallLab from './screens/PaywallLab.jsx'
import ReflectionCards from './screens/ReflectionCards.jsx'
import KaelDuo from './screens/KaelDuo.jsx'
import IntroConcept from './screens/IntroConcept.jsx'
import JourneyConcept from './screens/JourneyConcept.jsx'
import { Sparkle, Sun, Moon, Download, Camera, Grid } from './components/Icons.jsx'
import { kaelReply } from './kael.js'
import { CHAT, MOOD, getReflection } from './journal.js'

function nowTime() {
  return new Date()
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .toLowerCase()
}

const OPT = ['Tell me more', 'That lands', 'Honestly, I’m not sure']
const SEED = CHAT.map((m, i) => ({ id: i + 1, who: m.who, text: m.text, options: m.options }))

function ScreenView({ tab, messages, typing, draft, handlers }) {
  switch (tab) {
    case 'chat':
      return (
        <ChatScreen
          messages={messages}
          typing={typing}
          draft={draft}
          onDraftChange={handlers.setDraft}
          onSend={handlers.sendText}
          onWeave={handlers.weaveToday}
          onBack={handlers.goHome}
        />
      )
    case 'you':
      return <YouScreen theme={handlers.theme} onToggleTheme={handlers.toggleTheme} />
    case 'journey':
      return <JourneyScreen onOpenReflection={handlers.openReflection} />
    case 'patterns':
      return <PatternsScreen onOpenTag={handlers.openTag} />
    default:
      return (
        <HomeScreen
          onTalk={handlers.goChat}
          onMood={handlers.bringMood}
          onOpenReflection={handlers.openReflection}
          onSeeAll={handlers.goJourney}
        />
      )
  }
}

export default function App() {
  const [theme, setTheme] = useState('light')
  const [view, setView] = useState('app')
  const [studioTab, setStudioTab] = useState('components')
  const [tab, setTab] = useState('home')
  const [messages, setMessages] = useState(SEED)
  const [typing, setTyping] = useState(false)
  const [scale, setScale] = useState(0.72)
  const [stack, setStack] = useState([])
  const [sheet, setSheet] = useState(null)
  const [draft, setDraft] = useState('')
  const [shooting, setShooting] = useState(false)

  useLayoutEffect(() => {
    const fit = () => {
      const topH = document.querySelector('.stage-top')?.offsetHeight ?? 52
      // On phones, leave a wider margin so the mockup floats with space on
      // every side — lets it be screen-recorded like a phone-in-phone video
      // instead of running edge-to-edge. Desktop keeps the original tight fit.
      const phone = window.innerWidth <= 760
      const sideGap = phone ? 56 : 28 // total horizontal breathing room (px)
      const vertGap = phone ? 80 : 20 // vertical breathing room below the header (px)
      const avail = window.innerHeight - topH - vertGap
      const s = Math.min(avail / 954, (window.innerWidth - sideGap) / 452, 1)
      setScale(Math.max(0.4, s))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const idRef = useRef(SEED.length + 1)
  const timerRef = useRef(null)
  const ease = [0.22, 0.61, 0.36, 1]

  const nextId = () => idRef.current++

  function respond(replyText) {
    setTyping(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setMessages((m) => [...m, { id: nextId(), who: 'kael', text: replyText, options: OPT }])
      setTyping(false)
    }, 950)
  }

  function sendText(text) {
    const clean = text.trim()
    if (!clean) return
    setMessages((m) => [...m, { id: nextId(), who: 'user', text: clean, time: nowTime() }])
    respond(kaelReply(clean))
    setDraft('')
  }

  // tapping a Home mood doesn't send — it prefills the composer so the user
  // can read (and tweak) the line before hitting send.
  function bringMood(id) {
    setDraft(MOOD[id]?.seed || '')
    setTab('chat')
  }

  const openReflection = (id) => setStack((s) => [...s, { kind: 'reflection', id }])
  const openTag = (cat, name) =>
    setStack((s) => [...s, cat === 'patterns' ? { kind: 'pattern', name } : { kind: 'tag', cat, name }])
  const popStack = () => setStack((s) => s.slice(0, -1))
  const weaveToday = () => openReflection('today')
  const talkAbout = () => { setStack([]); setTab('chat') }

  function openSheet(detail) {
    setSheet(detail)
  }

  function sheetCta(message) {
    setSheet(null)
    setTab('chat')
    sendText(message)
  }

  // Capture just the screen content (no phone bezel) at 3x for a crisp,
  // shareable image of whatever is currently on screen.
  async function downloadShot() {
    const node = document.querySelector('.phone-screen')
    if (!node || shooting) return
    setShooting(true)
    // html-to-image resets scrollTop on its clone, so bake the current inner
    // scroll offset into a transform (then restore) to capture the scrolled
    // view rather than always snapping back to the top.
    const restore = []
    node.querySelectorAll('*').forEach((el) => {
      const s = el.scrollTop
      if (!s) return
      const kids = Array.from(el.children)
      const prevTransforms = kids.map((k) => k.style.transform)
      const prevOverflow = el.style.overflow
      el.style.overflow = 'hidden'
      el.scrollTop = 0
      kids.forEach((k) => {
        k.style.transform = `translateY(${-s}px)`
      })
      restore.push(() => {
        el.style.overflow = prevOverflow
        kids.forEach((k, i) => {
          k.style.transform = prevTransforms[i]
        })
        el.scrollTop = s
      })
    })
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
        style: { borderRadius: '0px' },
      })
      const stamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, '-')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `kael-${tab}-${theme}-${stamp}.png`
      a.click()
    } finally {
      restore.forEach((r) => r())
      setShooting(false)
    }
  }

  const handlers = {
    sendText,
    setDraft,
    goChat: () => setTab('chat'),
    goHome: () => setTab('home'),
    goJourney: () => { setStack([]); setTab('journey') },
    bringMood,
    openReflection,
    openTag,
    weaveToday,
    openSheet,
    theme,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return (
    <div className="stage" data-theme={theme}>
      <motion.header
        className="stage-top"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="brand-mark">
          <span className="brand-glyph">
            <Sparkle size={24} sw={1.5} />
          </span>
          <div>
            <div className="brand-name">Kael</div>
            <div className="brand-caption">Relationship intelligence</div>
          </div>
        </div>
        <div className="top-controls">
          <button
            className="shot-btn"
            data-on={view === 'studio'}
            onClick={() => setView((v) => (v === 'studio' ? 'app' : 'studio'))}
            aria-label="Design studio"
          >
            <Grid size={17} sw={1.6} />
          </button>
          {view === 'app' && (
            <button
              className="shot-btn"
              onClick={downloadShot}
              disabled={shooting}
              aria-label="Download screen as PNG"
            >
              <Download size={17} sw={1.6} />
            </button>
          )}
          <div className="toggle" role="group" aria-label="Theme">
            <button data-on={theme === 'light'} onClick={() => setTheme('light')} aria-label="Light">
              <Sun size={17} />
            </button>
            <button data-on={theme === 'dark'} onClick={() => setTheme('dark')} aria-label="Dark">
              <Moon size={17} />
            </button>
          </div>
        </div>
      </motion.header>

      <main className="stage-main">
        {view === 'studio' ? (
          <div className="studio">
            <div className="studio-tabs">
              <button
                className="studio-tab"
                data-on={studioTab === 'components'}
                onClick={() => setStudioTab('components')}
              >
                Components
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'brand'}
                onClick={() => setStudioTab('brand')}
              >
                Brand
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'store'}
                onClick={() => setStudioTab('store')}
              >
                App Store
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding'}
                onClick={() => setStudioTab('onboarding')}
              >
                Onboarding
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding-v2'}
                onClick={() => setStudioTab('onboarding-v2')}
              >
                Onboarding V2
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding-v3'}
                onClick={() => setStudioTab('onboarding-v3')}
              >
                Onboarding V3
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding-v4'}
                onClick={() => setStudioTab('onboarding-v4')}
              >
                Onboarding V4
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding-v5'}
                onClick={() => setStudioTab('onboarding-v5')}
              >
                Onboarding V5
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding-v6'}
                onClick={() => setStudioTab('onboarding-v6')}
              >
                Onboarding V6
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'onboarding-v7'}
                onClick={() => setStudioTab('onboarding-v7')}
              >
                Onboarding V7
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'paywall'}
                onClick={() => setStudioTab('paywall')}
              >
                Paywalls
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'cards'}
                onClick={() => setStudioTab('cards')}
              >
                Cards
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'duo'}
                onClick={() => setStudioTab('duo')}
              >
                2-Screen
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'intro'}
                onClick={() => setStudioTab('intro')}
              >
                Intro
              </button>
              <button
                className="studio-tab"
                data-on={studioTab === 'journey'}
                onClick={() => setStudioTab('journey')}
              >
                Journey
              </button>
            </div>
            <div className="studio-body">
              {studioTab === 'components' ? (
                <ComponentLibrary />
              ) : studioTab === 'brand' ? (
                <BrandGuide />
              ) : studioTab === 'store' ? (
                <StoreScreens />
              ) : studioTab === 'onboarding-v2' ? (
                <OnboardingV2 />
              ) : studioTab === 'onboarding-v3' ? (
                <OnboardingV3 />
              ) : studioTab === 'onboarding-v4' ? (
                <OnboardingV4 />
              ) : studioTab === 'onboarding-v5' ? (
                <OnboardingV5 />
              ) : studioTab === 'onboarding-v6' ? (
                <OnboardingV6 />
              ) : studioTab === 'onboarding-v7' ? (
                <OnboardingV7 />
              ) : studioTab === 'paywall' ? (
                <PaywallLab />
              ) : studioTab === 'cards' ? (
                <ReflectionCards />
              ) : studioTab === 'duo' ? (
                <KaelDuo />
              ) : studioTab === 'intro' ? (
                <IntroConcept />
              ) : studioTab === 'journey' ? (
                <JourneyConcept />
              ) : (
                <Onboarding />
              )}
            </div>
          </div>
        ) : (
        <motion.div
          className="stage-device"
          style={{ '--scale': scale }}
          initial={{ opacity: 0, y: 26, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
        >
          <PhoneFrame
            theme={theme}
            active={tab}
            onSelect={setTab}
            hideNav={tab === 'chat' || stack.length > 0}
            overlay={
              stack.length ? (() => {
                const top = stack[stack.length - 1]
                if (top.kind === 'reflection') {
                  return (
                    <ReflectionView
                      key={`r-${top.id}`}
                      r={getReflection(top.id)}
                      onBack={popStack}
                      onOpenTag={openTag}
                      onTalk={talkAbout}
                    />
                  )
                }
                if (top.kind === 'pattern') {
                  return (
                    <PatternView
                      key={`p-${top.name}`}
                      name={top.name}
                      onBack={popStack}
                      onOpenReflection={openReflection}
                    />
                  )
                }
                return (
                  <TagTimelineView
                    key={`t-${top.cat}-${top.name}`}
                    cat={top.cat}
                    name={top.name}
                    onBack={popStack}
                    onOpenReflection={openReflection}
                  />
                )
              })() : null
            }
            sheet={sheet}
            onCloseSheet={() => setSheet(null)}
            onSheetCta={sheetCta}
          >
            <ScreenView tab={tab} messages={messages} typing={typing} draft={draft} handlers={handlers} />
          </PhoneFrame>
        </motion.div>
        )}
      </main>

      {view === 'app' && (
        <button
          className="capture-fab"
          onClick={downloadShot}
          disabled={shooting}
          data-busy={shooting}
          aria-label="Save this screen as a high-res image"
          title="Save this screen as an image"
        >
          <Camera size={22} sw={1.7} />
        </button>
      )}
    </div>
  )
}
