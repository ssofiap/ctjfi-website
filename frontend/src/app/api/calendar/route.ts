import { NextResponse } from 'next/server';

type GoogleCalendarItem = {
  summary?: string;
  description?: string;
  location?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
};

type CalendarEvent = {
  title: string;
  date: string;
  time: string;
  category: string;
  description: string;
  location: string;
};

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function mapCalendarItem(item: GoogleCalendarItem): CalendarEvent | null {
  const startValue = item.start?.dateTime ?? item.start?.date;

  if (!startValue) {
    return null;
  }

  const date = item.start?.dateTime ?? `${startValue}T00:00:00`;

  return {
    title: item.summary ?? 'Untitled event',
    date,
    time: item.start?.dateTime ? formatTime(item.start.dateTime) : 'All day',
    category: 'Church',
    description: item.description ?? '',
    location: item.location ?? 'TBA',
  };
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;

  if (!calendarId || !apiKey) {
    return NextResponse.json(
      {
        error: 'Missing GOOGLE_CALENDAR_ID or GOOGLE_CALENDAR_API_KEY.',
      },
      { status: 500 },
    );
  }

  const now = new Date();
  const timeMin = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const timeMax = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString();

  const searchParams = new URLSearchParams({
    key: apiKey,
    singleEvents: 'true',
    orderBy: 'startTime',
    timeMin,
    timeMax,
    maxResults: '10',
    fields: 'items(summary,description,location,start)',
  });

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${searchParams.toString()}`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    return NextResponse.json(
      {
        error: `Google Calendar API request failed: ${response.status} ${response.statusText}`,
        details: errorText,
      },
      { status: response.status },
    );
  }

  const payload = (await response.json()) as { items?: GoogleCalendarItem[] };
  const events = (payload.items ?? [])
    .map(mapCalendarItem)
    .filter((event): event is CalendarEvent => event !== null)
    .slice(0, 5);

  return NextResponse.json({ events });
}