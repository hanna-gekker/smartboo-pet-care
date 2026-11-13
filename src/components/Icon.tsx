// Simple line icons. They take the current text color.

const paths = {
  today: 'M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z',
  schedule: 'M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 13h3M8 16.5h6',
  pets: 'M8.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM15.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 12.5c-2.6 0-5 3.2-5 5.4 0 1.6 1.3 2.1 2.6 2.1 1 0 1.6-.5 2.4-.5s1.4.5 2.4.5c1.3 0 2.6-.5 2.6-2.1 0-2.2-2.4-5.4-5-5.4z',
  mic: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21',
  camera: 'M4 8a1 1 0 0 1 1-1h2.5L9 5h6l1.5 2H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM12 16a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z',
  keyboard: 'M3.5 7a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1zM7 10h.01M10.5 10h.01M14 10h.01M17.5 10h.01M8 14h8',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7 7 0 0 1-2.1 1.2L14.7 21h-4l-.4-2.4a7 7 0 0 1-2.1-1.2l-1.9.7-2-3.4 1.6-1.2a7 7 0 0 1 0-2.4L4.3 9.9l2-3.4 1.9.7a7 7 0 0 1 2.1-1.2L10.7 3h4l.4 2.4a7 7 0 0 1 2.1 1.2l1.9-.7 2 3.4-1.6 1.2a7 7 0 0 1 0 2.4z',
  back: 'M15 5l-7 7 7 7',
  chevron: 'M9 5l7 7-7 7',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  plus: 'M12 5v14M5 12h14',
  share: 'M12 15V3.5M7.5 8 12 3.5 16.5 8M5 11.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8.5',
  phone: 'M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z',
  syringe: 'M17.5 3.5l3 3M19 5l-3 3M16 8l-9 9-3.5.5L4 14l9-9zM13.5 10.5 11 8M10.5 13.5 8 11',
  pill: 'M10.2 20.3a5 5 0 0 1-7-7l6.6-6.6a5 5 0 0 1 7 7zM7 10l7 7',
  scale: 'M4 7.5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM8.5 11a3.5 3.5 0 0 1 7 0M12 11l1.5-1.5',
  alert: 'M12 4 2.8 19.5h18.4zM12 10v4.5M12 17h.01',
  'alert-circle': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v4.5M12 16h.01',
  doc: 'M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M9 13h6M9 16.5h6',
  heart: 'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20',
  send: 'M5 12h13M12.5 6l6 6-6 6',
  more: 'M5.5 12h.01M12 12h.01M18.5 12h.01',
  sparkle: 'M12 3.5l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8zM18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 24, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
