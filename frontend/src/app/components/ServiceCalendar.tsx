"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Clock3, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";

type CalendarEvent = {
  title: string;
  date: string;
  endDate?: string;
  time: string;
  category: string;
  description: string;
  location: string;
};

type CalendarApiResponse = {
  events: CalendarEvent[];
  error?: string;
};

function getUpcomingEvents(events: CalendarEvent[], count: number) {
  return [...events]
    .sort(
      (left, right) =>
        parseISO(left.date).getTime() - parseISO(right.date).getTime(),
    )
    .slice(0, count);
}

type ServiceCalendarProps = {
  limit?: number;
};

export default function ServiceCalendar({ limit = 5 }: ServiceCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/calendar", {
          signal: controller.signal,
          cache: "no-store",
        });

        const data = (await response.json()) as CalendarApiResponse;

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load calendar events.");
        }

        setEvents(data.events ?? []);
      } catch (fetchError) {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === "AbortError"
        ) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load calendar events.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();

    return () => controller.abort();
  }, [retryCount]);

  const upcomingEvents = getUpcomingEvents(events, limit);

  return (
    <Card className="overflow-hidden border-0 bg-white shadow-none">
      <CardContent className="p-0">
        <div className="p-6 sm:p-8">
          <div className="mt-4 grid gap-5">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <article
                  key={index}
                  className="rounded-lg bg-white p-8 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-40 animate-pulse rounded-full bg-slate-100" />
                      <div className="h-4 w-64 animate-pulse rounded-full bg-slate-100" />
                      <div className="h-4 w-52 animate-pulse rounded-full bg-slate-100" />
                    </div>
                    <div className="h-20 w-full max-w-60 animate-pulse rounded-lg bg-slate-100 sm:w-60" />
                  </div>
                </article>
              ))
            ) : error ? (
              <div className="rounded-lg bg-white px-4 py-3 text-sm font-light text-slate-600 shadow-sm">
                <p>{error}</p>
                <button
                  type="button"
                  className="mt-3 font-medium text-blue-600 underline-offset-4 hover:underline"
                  onClick={() => setRetryCount((count) => count + 1)}
                >
                  Try again
                </button>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="rounded-lg bg-white px-4 py-3 text-sm font-light text-slate-600 shadow-sm">
                No upcoming events are available right now.
              </div>
            ) : (
              upcomingEvents.map((event) => {
                const eventDate = parseISO(event.date);
                const eventEndDate = event.endDate
                  ? parseISO(event.endDate)
                  : eventDate;
                const hasDateRange =
                  format(eventEndDate, "yyyy-MM-dd") !==
                  format(eventDate, "yyyy-MM-dd");

                return (
                  <article
                    key={`${event.title}-${event.date}`}
                    className="group w-full cursor-default rounded-lg bg-white p-8 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                  >
                    <div className="grid grid-cols-1 gap-3 md:min-h-14 md:grid-cols-[160px_100px_minmax(0,1fr)] md:items-start md:gap-4">
                      <div className="min-w-0 space-y-1 break-words">
                        <h4 className="text-base font-light tracking-tight text-slate-900">
                          {event.title}
                        </h4>
                        <p className="text-sm font-light leading-6 text-slate-600">
                          {event.description}
                        </p>
                      </div>

                      <div className="leading-tight">
                        <p className="text-sm font-medium text-slate-900">
                          {hasDateRange
                            ? `${format(eventDate, "EEE, MMM d")} - ${format(eventEndDate, "EEE, MMM d")}`
                            : format(eventDate, "EEE, MMM d")}
                        </p>
                      </div>

                      <div className="space-y-1 text-sm font-light leading-5 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-slate-500" />
                          <span className="leading-none">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-500" />
                          <span className="leading-none">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
