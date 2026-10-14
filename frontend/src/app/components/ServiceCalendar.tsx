'use client';

import { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export default function ServiceCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex gap-8">
      <Card className="border-0 shadow-none hover:scale-105 hover:shadow-lg transition-all duration-300 flex-1">
        <CardHeader>
          <CardTitle className="text-xl font-normal text-black">Schedule</CardTitle>
          <CardDescription className="text-sm text-gray-600 font-light">
            To be implemented: A list of our regular service times and events, with a database connection to the calendar for dynamic updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">SUN</span>
            </div>
            <div>
              <h4 className="font-normal text-black mb-1">Sunday Service</h4>
              <p className="text-sm text-gray-600 font-light">10:00 AM or 02:00 PM
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-sm">FRI</span>
            </div>
            <div>
              <h4 className="font-normal text-black mb-1">Friday Prayer Meeting</h4>
              <p className="text-sm text-gray-600 font-light">
                7:00 PM
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-none hover:scale-105 hover:shadow-lg transition-all duration-300 flex-1">
        <CardHeader>
          <CardTitle className="text-xl font-normal text-black">Calendar</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 font-light mb-4">
            To be implemented: A calendar view of our upcoming events and services
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
