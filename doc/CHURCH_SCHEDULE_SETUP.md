# Church Venue Rental Schedule System

## Architecture Overview

```
Supabase (PostgreSQL DB + REST API)
         ↓
React Calendar Component (displays schedule)
         ↓
Website (visitor-facing)

+ Admin Panel (manage times via simple form)
```

---

## Part 1: Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) (free tier)
2. Create a new project
3. Get your **API URL** and **anon key** (you'll need these)

### Step 2: Create Table

In Supabase SQL Editor, run:

```sql
CREATE TABLE schedule (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_date DATE NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'Sunday Worship' or 'Prayer Meeting'
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;

-- Public read access (for website)
CREATE POLICY "Allow public read" ON schedule
  FOR SELECT USING (true);

-- Admin write access (you'll restrict this later with auth)
CREATE POLICY "Allow authenticated write" ON schedule
  FOR INSERT, UPDATE, DELETE
  WITH CHECK (true);
```

### Step 3: Add Sample Data

```sql
INSERT INTO schedule (event_date, event_type, start_time, end_time, notes) VALUES
  ('2026-03-29', 'Sunday Worship', '10:00:00', '11:30:00', 'Main service'),
  ('2026-03-29', 'Prayer Meeting', '19:00:00', '20:00:00', 'Evening prayers'),
  ('2026-04-05', 'Sunday Worship', '10:00:00', '11:30:00', NULL),
  ('2026-04-12', 'Sunday Worship', '09:00:00', '10:30:00', 'Early service - rented to external group');
```

---

## Part 2: React Calendar Component

### Dependencies
```bash
npm install @supabase/supabase-js react-big-calendar date-fns
```

### Code: `ScheduleCalendar.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, isEqual, isSunday } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './ScheduleCalendar.css';

// Initialize Supabase
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function ScheduleCalendar() {
  const [schedule, setSchedule] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  // Fetch schedule from Supabase
  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .gte('event_date', format(startOfMonth(currentMonth), 'yyyy-MM-dd'))
      .lte('event_date', format(endOfMonth(currentMonth), 'yyyy-MM-dd'));

    if (error) {
      console.error('Error fetching schedule:', error);
    } else {
      setSchedule(data || []);
    }
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedule.filter(event => event.event_date === dateStr);
  };

  // Render calendar with Sundays highlighted
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}

        {daysInMonth.map(day => {
          const events = getEventsForDate(day);
          const isSundayDate = isSunday(day);
          const isHovered = hoveredDate && isEqual(format(hoveredDate, 'yyyy-MM-dd'), format(day, 'yyyy-MM-dd'));

          return (
            <div
              key={day.toISOString()}
              className={`calendar-day ${isSundayDate ? 'sunday' : ''} ${isHovered ? 'hovered' : ''} ${events.length > 0 ? 'has-events' : ''}`}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <div className="day-number">{format(day, 'd')}</div>
              
              {isHovered && events.length > 0 && (
                <div className="events-tooltip">
                  {events.map(event => (
                    <div key={event.id} className="event-item">
                      <div className="event-type">{event.event_type}</div>
                      <div className="event-time">
                        {format(parse(event.start_time, 'HH:mm:ss', new Date()), 'h:mm a')} - 
                        {format(parse(event.end_time, 'HH:mm:ss', new Date()), 'h:mm a')}
                      </div>
                      {event.notes && <div className="event-notes">{event.notes}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Indicator dot when events exist */}
              {events.length > 0 && !isHovered && (
                <div className="event-indicator"></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="schedule-calendar">
      <div className="calendar-header">
        <h2>Venue Availability</h2>
        <div className="month-nav">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
            ← Previous
          </button>
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
            Next →
          </button>
        </div>
      </div>

      {renderCalendar()}

      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot"></div>
          <span>Scheduled events - hover to view times</span>
        </div>
      </div>
    </div>
  );
}
```

### Styles: `ScheduleCalendar.css`

```css
.schedule-calendar {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Georgia', serif;
}

.calendar-header {
  text-align: center;
  margin-bottom: 2rem;
}

.calendar-header h2 {
  font-size: 2rem;
  color: #1a3a3a;
  margin-bottom: 1rem;
}

.month-nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  align-items: center;
  font-size: 1.1rem;
  color: #666;
}

.month-nav button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: #f9f9f9;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.month-nav button:hover {
  background: #e8e8e8;
  border-color: #999;
}

/* Calendar Grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #ddd;
  border: 1px solid #ddd;
  margin-bottom: 2rem;
}

.calendar-day-header {
  background: #2c5aa0;
  color: white;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.calendar-day {
  background: white;
  min-height: 120px;
  padding: 0.75rem;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.calendar-day:hover {
  background: #f5f5f5;
}

.calendar-day.sunday {
  background: #f0f4f8;
}

.calendar-day.hovered {
  background: #e3f2fd;
  border: 2px solid #2c5aa0;
  z-index: 10;
}

.calendar-day.has-events .day-number {
  font-weight: bold;
  color: #2c5aa0;
}

.day-number {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

/* Hover Tooltip */
.events-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #2c5aa0;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 20;
  min-width: 280px;
  margin-top: 0.5rem;
}

.event-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.event-item:last-child {
  border-bottom: none;
}

.event-type {
  font-weight: bold;
  color: #2c5aa0;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.event-time {
  color: #666;
  font-size: 0.9rem;
  font-family: 'Monaco', monospace;
}

.event-notes {
  color: #999;
  font-size: 0.85rem;
  font-style: italic;
  margin-top: 0.25rem;
}

/* Event Indicator Dot */
.event-indicator {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  background: #2c5aa0;
  border-radius: 50%;
}

/* Legend */
.legend {
  text-align: center;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
  border-left: 4px solid #2c5aa0;
}

.legend-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  background: #2c5aa0;
  border-radius: 50%;
}
```

---

## Part 3: Environment Variables

Create `.env.local`:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from Supabase → Settings → API

---

## Part 4: Admin Panel (Simple Form)

Create `AdminScheduleForm.jsx`:

```jsx
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function AdminScheduleForm() {
  const [formData, setFormData] = useState({
    event_date: format(new Date(), 'yyyy-MM-dd'),
    event_type: 'Sunday Worship',
    start_time: '10:00',
    end_time: '11:30',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('schedule')
      .insert([{
        event_date: formData.event_date,
        event_type: formData.event_type,
        start_time: formData.start_time + ':00',
        end_time: formData.end_time + ':00',
        notes: formData.notes || null,
      }]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('✓ Schedule added successfully!');
      setFormData({
        event_date: format(new Date(), 'yyyy-MM-dd'),
        event_type: 'Sunday Worship',
        start_time: '10:00',
        end_time: '11:30',
        notes: '',
      });
    }
    setLoading(false);
  };

  return (
    <div className="admin-form">
      <h2>Add Scheduled Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Event Type</label>
          <select name="event_type" value={formData.event_type} onChange={handleChange}>
            <option>Sunday Worship</option>
            <option>Prayer Meeting</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <input
            type="text"
            name="notes"
            placeholder="e.g., Rented to external group"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Event'}
        </button>

        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
}
```

---

## Deployment Guide

### Frontend (Deploy to Vercel - free)
```bash
npm install -g vercel
vercel
```

Follow prompts, add your `.env.local` variables in Vercel dashboard.
If you deploy through GitHub Actions, add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as repository secrets.

### Admin Panel (Protect with auth)
For production, add Supabase Auth:
1. Enable Email auth in Supabase dashboard
2. Wrap AdminScheduleForm with authentication check
3. Use `supabase.auth.onAuthStateChange()` to protect the form

---

## Summary: Tech Stack

| Component | Tool | Cost | Why |
|-----------|------|------|-----|
| Database | Supabase | Free (generous tier) | Auto REST API, real-time, PostgreSQL |
| Frontend | React | Free | Modern, component-based |
| Calendar | Custom (date-fns) | Free | Lightweight, customizable |
| Hosting | Vercel | Free | Automatic builds, great DX |
| Admin | Supabase UI / Custom Form | Free | No-code or simple form |

---