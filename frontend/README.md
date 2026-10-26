# RetailRadar AI - Frontend

RetailRadar AI is an AI-powered Retail Expansion Intelligence Platform that helps businesses find the right location to grow with confidence.

## Features

- **Dashboard** - KPI overview with charts and recent activity
- **Location Explorer** - Interactive map with search and filters for finding potential retail sites
- **AI Recommendations** - Ranked location suggestions with suitability scores, positive factors, and risks
- **Market Gap Analysis** - Identify underserved areas and analyze competitor coverage
- **What-If Simulator** - Model different scenarios with adjustable assumptions
- **Site Comparison** - Compare 2-3 locations side by side with detailed metrics
- **Reports** - View analysis history with print-friendly report layouts
- **Data Management** - Import locations via CSV and configure scoring preferences

## Tech Stack

- **React.js** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Leaflet & React Leaflet** - Interactive maps
- **CSS3** - Styling with CSS custom properties

## File Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── layouts/        # Layout components (AppLayout)
│   ├── pages/          # Page components (all 8 pages)
│   ├── services/       # API service layer
│   ├── assets/         # Images and static assets
│   ├── App.jsx         # Main app with routing
│   ├── App.css         # App-specific styles
│   ├── index.css       # Global styles and design system
│   └── main.jsx        # App entry point
├── public/             # Public static assets
├── .env.example        # Environment variables template
└── package.json        # Dependencies and scripts
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables (see below)

## Environment Configuration

Create a `.env` file in the frontend root with:

```env
VITE_API_URL=http://localhost:5000
```

A `.env.example` file is provided with the default configuration.

## Available Commands

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## API Endpoints Used

The frontend communicates with the backend via these endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Check API connectivity |
| GET | `/api/locations` | Fetch location data |
| POST | `/api/locations` | Create new location |
| POST | `/api/analysis/run` | Run AI analysis |
| GET | `/api/analysis/:id` | Get analysis results |
| POST | `/api/analysis/compare` | Compare locations |
| POST | `/api/analysis/simulate` | Run what-if simulation |
| GET | `/api/reports` | Fetch reports history |

All API calls are centralized in `src/services/api.js`. The base URL is read from `VITE_API_URL` with a fallback to `http://localhost:5000`.

## Expected Request/Response Assumptions (Need Backend Confirmation)

### GET /api/locations
**Response:** Array of location objects
```json
[
  {
    "id": 1,
    "name": "Location Name",
    "city": "City",
    "region": "State/Region",
    "lat": 30.2672,
    "lng": -97.7431,
    "population": 125000,
    "rent": 24,
    "competition": 3,
    "suitability": 94
  }
]
```

### POST /api/analysis/run
**Request:**
```json
{
  "location": "Austin, TX",
  "businessType": "retail",
  "budget": "$50k - $100k"
}
```
**Response:**
```json
{
  "recommendations": [
    {
      "id": 1,
      "name": "Location Name",
      "city": "City, State",
      "score": 94,
      "positiveFactors": ["..."],
      "risks": ["..."],
      "explanation": "..."
    }
  ]
}
```

### POST /api/analysis/compare
**Request:**
```json
{
  "locations": [1, 2, 3]
}
```
**Response:** Comparison data structure (format TBD by backend)

### POST /api/analysis/simulate
**Request:** What-if assumptions object
**Response:** Simulation results

### GET /api/reports
**Response:** Array of report objects
```json
[
  {
    "id": 1,
    "title": "Report Title",
    "date": "2024-01-15",
    "type": "Market Analysis",
    "locations": 12,
    "status": "Completed"
  }
]
```

## Demo Mode vs Backend Mode

### Works in Demo Mode (No Backend Required)
- All 8 pages are fully functional with UI
- Dashboard shows sample KPI data and charts
- Location Explorer works with sample locations and interactive map
- AI Recommendations shows sample ranked results
- Market Gap Analysis displays illustrative data
- What-If Simulator performs frontend calculations
- Site Comparison works with sample locations
- Reports displays sample history with print functionality
- Data Management allows CSV preview and local preference saving

### Requires Backend Connection
- Real location data from `/api/locations`
- Actual AI analysis results from `/api/analysis/run`
- Live comparison data from `/api/analysis/compare`
- Server-side simulation from `/api/analysis/simulate`
- Persistent report history from `/api/reports`
- Saving locations via `/api/locations` POST
- API health status monitoring

**Important Notes:**
- Demo data is clearly labeled with badges throughout the UI
- Failed API calls fall back to demo data with honest error messages
- CSV uploads attempt API submission but clearly report success/failure
- Scoring preferences save locally only (no server persistence endpoint available)
- No mock data is silently substituted after failed write operations

## Design System

- **Colors:** Deep navy (#0f172a), white, light grey (#f8fafc), emerald green (#10b981)
- **Typography:** Inter font family
- **Responsive:** Mobile-first design with breakpoints at 768px and 1024px
- **Components:** Consistent cards, buttons, forms, tables, and badges
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation support

## Completed Features
- [x] All 8 pages implemented
- [x] Responsive layout with sidebar navigation
- [x] Interactive Leaflet maps
- [x] Recharts visualizations
- [x] API service layer with error handling
- [x] Demo mode with clearly labeled sample data
- [x] CSV import with validation and preview
- [x] Print-friendly reports
- [x] What-if simulator with frontend calculations
- [x] Site comparison functionality
- [x] Build passes successfully

## Remaining Limitations
- Some lint warnings remain (non-blocking for functionality)
- Backend API integration untested (no backend running)
- CSV parsing is basic (handles simple comma-separated values)
- Map requires internet connection for tile loading
- Large datasets may impact performance (no pagination implemented)
