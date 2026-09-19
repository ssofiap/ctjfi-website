# Church Schedule Integration

The website displays upcoming church services and events from a public Google
Calendar. Google Calendar is the source of truth; there is no Supabase database
or custom admin form in the current implementation.

## Architecture

```text
Google Calendar
      |
      v
Next.js /api/calendar route
      |
      v
ServiceCalendar component
      |
      +--> Homepage: next 5 events
      +--> /calendar: next 10 events
```

The browser requests `/api/calendar`. The server route calls the Google
Calendar API with the private API key, selects the event fields used by the
site, and returns a normalized response:

```json
{
  "events": [
    {
      "title": "Sunday Worship",
      "date": "2026-09-20T10:00:00+02:00",
      "time": "10:00 AM",
      "category": "Church",
      "description": "",
      "location": "Geneva"
    }
  ]
}
```

The route is implemented in `frontend/src/app/api/calendar/route.ts`. The UI
is implemented in `frontend/src/app/components/ServiceCalendar.tsx`, and the
full calendar page is `frontend/src/app/calendar/page.tsx`.

## Google Cloud Setup

1. Create or select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the Google Calendar API for that project.
3. Create an API key under **APIs & Services > Credentials**.
4. Restrict the key to the Google Calendar API. If HTTP referrer restrictions
   are used, add the local and deployed site domains.
5. Make the source calendar publicly readable. This integration uses an API
   key and does not sign users into Google.
6. Copy the calendar ID from Google Calendar's **Settings and sharing** page.

## Environment Variables

Create `frontend/.env.local` for local development:

```bash
GOOGLE_CALENDAR_ID=your_calendar_id
GOOGLE_CALENDAR_API_KEY=your_google_api_key
```

The variables are read only by the Next.js server route. Do not rename them to
`NEXT_PUBLIC_*`, expose the API key in client code, commit `.env.local`, or
paste a real key into documentation. The local env file is ignored by git.

For Vercel, add both variables to the Preview and Production environments in
the project settings. Rotate the key if it has been exposed in source,
terminal output, chat, or logs.

## Runtime Behavior

The API route:

- Requests events from 24 hours before the current time through 180 days ahead.
- Requests single events ordered by start time.
- Returns at most 10 events.
- Includes timed and all-day events.
- Formats timed events in the `Europe/Zurich` timezone.
- Uses `TBA` when an event has no location and `Untitled event` when it has no title.
- Returns an error when credentials are missing, Google cannot be reached, the
  Google request fails, or Google returns invalid JSON.

The `ServiceCalendar` component shows loading placeholders while it fetches,
an error message with a **Try again** action when the request fails, and an
empty state when no events are available. The homepage uses the default limit
of five events. The dedicated `/calendar` page passes `limit={10}`.

## Local Development

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The calendar is visible
in the homepage's **Service Times** section and at
[http://localhost:3000/calendar](http://localhost:3000/calendar).

Useful checks before deployment:

```bash
npm run lint
npm run build
```

To test the API directly while the development server is running:

```bash
curl http://localhost:3000/api/calendar
```

## Deployment

The frontend is a Next.js application intended for Vercel. Deploy the
`frontend` directory, configure `GOOGLE_CALENDAR_ID` and
`GOOGLE_CALENDAR_API_KEY` in the Vercel project, and verify `/api/calendar`
after deployment.

The API key must remain server-side. If a browser-restricted key is used,
configure the deployed site's allowed referrers in Google Cloud.

## Current Limitations

- There is no schedule-management or admin panel in the application.
- Events are managed in Google Calendar.
- The API returns only the first 10 events in its time window.
- The UI currently displays the event start time, not an end time.
- The integration does not use Supabase, `react-big-calendar`, or a custom
  month-grid schedule component.
