# Mahal al Shifa Appointment System

A modern, responsive React web app that displays a monthly doctor
appointment roster. The schedule is never hand-coded — an admin uploads
an Excel (`.xlsx` / `.xls`) or JSON file and the whole site (the "Next Day
Doctors" carousel and the full Monthly Roster) updates automatically.

## Features

- **Next Day Doctors carousel** — auto-rotating, on the homepage, showing
  every doctor scheduled for tomorrow (name, specialty, timing, photo,
  "View Details").
- **Monthly Roster** — calendar view (click a date to see who's visiting)
  and a sortable table view, both filterable by specialty and doctor name.
- **Admin upload** — drag-and-drop `.xlsx` / `.xls` / `.json` upload with a
  preview step before publishing, flexible column-name matching, and a
  downloadable sample template.
- **Healthcare-inspired design** — white/teal/soft-blue/sage-green palette,
  glassmorphism cards, rounded corners, smooth motion, fully responsive.
- **Modular architecture** — see [Architecture](#architecture) below. Login,
  token management, doctor profiles, reports, health advice, WhatsApp
  support, emergency assistance, an event calendar, and a full admin
  dashboard can all be added without restructuring what's here.

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

Requires Node.js 18+.

## Uploading a roster

Open the app, click **Admin** (top navigation or footer), and upload a
file with these columns (names are matched flexibly, e.g. "Doctor" or
"Department" work too):

| Date       | DoctorName        | Specialty   | Timing              | Photo (optional) |
|------------|--------------------|-------------|----------------------|-------------------|
| 2026-07-19 | Dr. Ayesha Khan     | Cardiology  | 9:00 AM – 12:00 PM  | (image URL)       |

A "Download sample template" button in the Admin panel generates a ready
JSON example. Until a real file is uploaded, the app shows sample demo
data so the interface is never empty.

## Architecture

```
src/
  context/RosterContext.jsx   # single source of truth for roster data + actions
  data/
    rosterService.js          # storage abstraction (localStorage today,
                               # swap for a real API later — see FUTURE: notes)
    parseFile.js               # reads raw rows out of .xlsx/.xls/.json
    sampleRoster.js             # demo data generator
  utils/
    normalizeRoster.js          # maps flexible spreadsheet headers -> standard shape
    dateUtils.js                 # date/calendar helpers
  components/                    # one folder per component, each with its own CSS
    Navbar, Hero, NextDayCarousel, DoctorCard, DoctorModal,
    MonthlyRoster, CalendarView, Filters, About, Footer,
    AdminUpload, AdminModal
```

Every component reads roster data through `useRoster()` — nothing talks to
`localStorage` directly except `rosterService.js`. That means:

- **Swapping storage for a real backend** only touches `rosterService.js`.
- **Adding login/tokens** only touches `AdminModal.jsx` (wrap its contents
  with an auth check) plus a new `AuthContext`.
- **Doctor profiles, reports, health advice, WhatsApp/emergency support,
  event calendar** are all new routes/components that can read the same
  `useRoster()` data without touching what already exists.
- **Admin dashboard** can reuse `AdminUpload` as one panel among several.

## Tech stack

- React 18 + Vite
- [SheetJS (`xlsx`)](https://www.npmjs.com/package/xlsx) for Excel parsing
- Plain CSS (custom properties for theming, no framework lock-in)
