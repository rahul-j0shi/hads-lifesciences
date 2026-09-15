import type { ValueItem } from '../content'

/**
 * Four small line marks matching the artwork's value bar.
 *
 * Drawn inline rather than pulled from an icon package: four glyphs do not
 * justify a runtime dependency, and the performance rules forbid loading a full
 * icon registry for one row. Decorative, so hidden from assistive technology.
 */
const PATHS: Record<ValueItem['icon'], React.JSX.Element> = {
  award: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" />
    </>
  ),
  recycle: (
    <>
      <path d="M7 19H5a2 2 0 0 1-1.7-3l1.6-2.7" />
      <path d="m9.8 4.6 1.5-2.6a2 2 0 0 1 3.4 0l1.4 2.4" />
      <path d="M17 19h2a2 2 0 0 0 1.7-3l-3.4-5.8" />
      <path d="m6.9 10.8 2-3.4M14 19H9l2-3M8 8H5l1.5 2.6" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .9 1.6h5.2c.1-.6.4-1.2.9-1.6A6 6 0 0 0 12 3Z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
    </>
  ),
}

export function ValueIcon({ name }: { name: ValueItem['icon'] }): React.JSX.Element {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
