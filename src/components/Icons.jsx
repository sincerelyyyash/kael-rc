/* Icon set — Phosphor-backed adapter.
   Preserves the app's icon names + { size, sw } convention so call sites stay stable.
   `sw` (legacy stroke width) maps to Phosphor `weight`: >= 1.8 -> 'bold', else 'regular'.
   Status-bar glyphs (Cellular/Wifi/Battery) stay bespoke for the iOS look. */
import {
  House,
  ChatCircle,
  ChatCircleDots,
  User,
  Path,
  Sparkle as PhSparkle,
  CaretRight,
  ArrowLeft,
  ArrowUpRight as PhArrowUpRight,
  ArrowBendUpLeft,
  ArrowsOutLineHorizontal,
  ArrowsSplit,
  Plus as PhPlus,
  PaperPlaneTilt,
  SlidersHorizontal,
  X as PhX,
  Spiral as PhSpiral,
  Lightning,
  HandPalm,
  DotsThreeOutline,
  Repeat,
  Compass as PhCompass,
  Pulse as PhPulse,
  BookOpen,
  BookmarkSimple,
  MagnifyingGlass,
  Detective as PhDetective,
  Paragraph as PhParagraph,
  Quotes,
  GridFour,
  Clock as PhClock,
  SmileyMeh,
  SmileyNervous,
  Sunglasses,
  HeartBreak,
  SunHorizon,
  CloudFog,
  CloudRain,
  Leaf,
  Waves,
  CircleHalf,
  Mountains,
  Heart as PhHeart,
  HandHeart as PhHandHeart,
  ShieldCheck as PhShield,
  Anchor as PhAnchor,
  Thermometer as PhThermometer,
  Footprints as PhFootprints,
  Phone as PhPhone,
  ArrowsIn as PhArrowsIn,
  Wind as PhWind,
  Flag as PhFlag,
  ArrowsClockwise,
  Lightbulb,
  Scales,
  Sun as PhSun,
  Moon as PhMoon,
  Microphone as PhMic,
  DownloadSimple as PhDownload,
  SquaresFour as PhGrid,
  Lighthouse as PhLighthouse,
  Flame as PhFlame,
  CalendarHeart as PhCalendarHeart,
  Target as PhTarget,
  Camera as PhCamera,
} from '@phosphor-icons/react'

/* Wrap a Phosphor icon to honour our { size, sw, weight } API.
   sw is consumed (not forwarded) so it never leaks onto the DOM node. */
const make =
  (Ph, defaultWeight = 'regular') =>
  function Icon({ size = 22, sw, weight, ...rest }) {
    const w = weight ?? (sw != null && sw >= 1.8 ? 'bold' : defaultWeight)
    return <Ph size={size} weight={w} {...rest} />
  }

/* ---- navigation ---- */
export const Home = make(House)
export const Chat = make(ChatCircle)
export const Person = make(User)
export const Route = make(Path)

/* ---- glyphs ---- */
export const Sparkle = make(PhSparkle)
export const ChevronRight = make(CaretRight)
export const Back = make(ArrowLeft)
export const ArrowUpRight = make(PhArrowUpRight)
export const Plus = make(PhPlus)
export const Send = make(PaperPlaneTilt)
export const Mic = make(PhMic)
export const Download = make(PhDownload)
export const Camera = make(PhCamera)
export const Grid = make(PhGrid)
export const Sliders = make(SlidersHorizontal)
export const Close = make(PhX)
export const Clock = make(PhClock)
export const Bookmark = make(BookmarkSimple)

/* ---- prompt cards ---- */
export const Spiral = make(PhSpiral)
export const Bolt = make(Lightning)
export const Distance = make(ArrowsOutLineHorizontal)
export const Reply = make(ArrowBendUpLeft)
export const Fork = make(ArrowsSplit)
export const LoopText = make(ChatCircleDots)
export const TurnAway = make(HandPalm)
export const Ellipsis = make(DotsThreeOutline)

/* ---- threads / loops ---- */
export const Loop = make(Repeat)
export const Compass = make(PhCompass)
export const Pulse = make(PhPulse)
export const Book = make(BookOpen)

/* ---- journey moment types ---- */
export const Bulb = make(Lightbulb)
export const Balance = make(Scales)
export const Wave = make(Waves)
export const Cloud = make(CloudRain)
export const Flag = make(PhFlag)
export const Cycle = make(ArrowsClockwise)

/* ---- you: moves + read ---- */
export const Search = make(MagnifyingGlass)
export const Detective = make(PhDetective)
export const Paragraph = make(PhParagraph)
export const Quote = make(Quotes)
export const NeutralFace = make(SmileyMeh)
export const Shades = make(Sunglasses)

/* ---- chip glyphs ---- */
export const Pattern = make(GridFour)

/* ---- mood glyphs ---- */
export const MoodAnxious = make(SmileyNervous)
export const MoodHurt = make(HeartBreak)
export const MoodHopeful = make(SunHorizon)
export const MoodNumb = make(CloudFog)
export const MoodLonely = make(PhMoon)
export const MoodCalm = make(Leaf)
export const MoodOverwhelmed = make(Waves)

/* ---- learn: per-topic seals ---- */
export const Thermometer = make(PhThermometer)
export const Footprints = make(PhFootprints)
export const Phone = make(PhPhone)
export const Shrink = make(PhArrowsIn)
export const Wind = make(PhWind)

/* ---- home: inner weather ---- */
export const Clear = make(PhSun)
export const Steady = make(CircleHalf)
export const Tender = make(PhHeart)
export const Foggy = make(CloudFog)
export const Restless = make(Mountains)
export const Heavy = make(CloudRain)

/* ---- mirror: needs ---- */
export const Heart = make(PhHeart)
export const HandHeart = make(PhHandHeart)
export const Shield = make(PhShield)
export const Anchor = make(PhAnchor)

/* ---- home: hero + archetype + feed ---- */
export const Lighthouse = make(PhLighthouse)
export const Flame = make(PhFlame)
export const CalendarHeart = make(PhCalendarHeart)
export const Target = make(PhTarget)

/* ---- theme toggle ---- */
export const Sun = make(PhSun)
export const Moon = make(PhMoon)

/* ============================================================
   Status bar — bespoke aspect ratios, kept custom for the iOS look.
   ============================================================ */
export const Cellular = ({ size = 17 }) => (
  <svg width={size} height={size * (12 / 17)} viewBox="0 0 17 12" fill="currentColor">
    <rect x="0" y="8.5" width="2.6" height="3.5" rx="0.8" />
    <rect x="4.4" y="6" width="2.6" height="6" rx="0.8" />
    <rect x="8.8" y="3" width="2.6" height="9" rx="0.8" />
    <rect x="13.2" y="0" width="2.6" height="12" rx="0.8" />
  </svg>
)
export const Wifi = ({ size = 17 }) => (
  <svg
    width={size}
    height={size * (12 / 17)}
    viewBox="0 0 17 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M1 4.2a11 11 0 0 1 15 0" />
    <path d="M3.4 6.8a7.3 7.3 0 0 1 10.2 0" />
    <path d="M5.8 9.3a3.8 3.8 0 0 1 5.4 0" />
    <circle cx="8.5" cy="11" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)
export const Battery = ({ size = 25 }) => (
  <svg width={size} height={size * (12 / 25)} viewBox="0 0 25 12" fill="none">
    <rect x="0.6" y="0.6" width="20" height="10.8" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <rect x="2.2" y="2.2" width="15" height="7.6" rx="1.8" fill="currentColor" />
    <path d="M22.6 4.2v3.6a2 2 0 0 0 1.2-1.8 2 2 0 0 0-1.2-1.8Z" fill="currentColor" opacity="0.5" />
  </svg>
)
