import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import ServiceCalendar from "../components/ServiceCalendar";

export const metadata: Metadata = {
  title: "Calendar | CTJFI",
  description:
    "Upcoming services and events at Come to Jesus Fellowship International.",
};

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navigation />

      <main className="flex-1 px-6 py-20">
        <div className="mx-auto w-full max-w-4xl">
          <header className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-normal text-black">Calendar</h1>
            <p className="font-light text-gray-600">
              Upcoming services and events
            </p>
          </header>

          <ServiceCalendar limit={10} />
        </div>
      </main>

      <footer className="bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-gray-600">
          <p className="text-sm">
            &copy; 2026. Come to Jesus Fellowship International. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
