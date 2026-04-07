// ICS (iCalendar) file generation for Apple Calendar and other calendar apps

interface ICSEvent {
  title: string
  description: string
  startAt: Date
  durationMinutes: number
}

function formatDateUTC(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function generateUID(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}@seen.app`
}

export function generateICS(events: ICSEvent[]): string {
  const vevents = events.map(event => {
    const start = new Date(event.startAt)
    const end = new Date(start.getTime() + event.durationMinutes * 60 * 1000)

    return `BEGIN:VEVENT
UID:${generateUID()}
DTSTART:${formatDateUTC(start)}
DTEND:${formatDateUTC(end)}
SUMMARY:SEEN: ${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: ${event.title} in 15 minutes
END:VALARM
END:VEVENT`
  }).join('\n')

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SEEN//Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${vevents}
END:VCALENDAR`
}

export function downloadICS(events: ICSEvent[], filename = 'seen-exercises.ics') {
  const content = generateICS(events)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
