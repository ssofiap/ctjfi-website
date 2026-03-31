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
          <CardTitle className="text-xl font-normal text-black">Calendar</CardTitle>
          <CardDescription className="text-sm text-gray-600 font-light">
            View our upcoming events and services
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-200">
            <iframe 
              src="https://calendar.google.com/calendar/embed?src=11f421299e6b052074a0a57bcc63576fbfed80d1bab7310c36571c52062d965c%40group.calendar.google.com&ctz=Europe%2FZurich" 
              style={{ border: 0 }} 
              width="100%" 
              height="100%" 
              title="Church Calendar"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
