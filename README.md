# PROGNORIA

A professional predictive analytics dashboard combining Finance (Stock Markets) and Sports prediction widgets. Built with React, Vite, and Tailwind CSS.

![Prognoria](https://img.shields.io/badge/Prognoria-Predictive%20Analytics-00ff9d?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0-646cff?style=flat-square&logo=vite)

## Features

### Finance Dashboard
- **Stock Signals** - Real-time buy/sell/hold recommendations for 12 major stocks using Finnhub API
- **Stock Chart** - Interactive 30-day price charts with search functionality
- **Trend Predictor** - Technical analysis with RSI, momentum, support/resistance levels
- **News Widget** - Latest market news for selected ticker
- **Watchlist** - Track your favorite stocks

### Sports Dashboard
- **Match Predictions** - AI-generated predictions for upcoming football/soccer matches
- **Form Table** - League standings with team form indicators
- **Live Scores** - Real-time match score updates

### Supported Leagues
- Premier League (EPL)
- La Liga
- Bundesliga
- Serie A
- Ligue 1
- NBA

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Phosphor Icons
- **APIs**: Finnhub (Finance), TheSportsDB (Sports)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/moswek/prognoria.git
cd prognoria

# Install dependencies
npm install

# Create .env file with your API keys
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FINNHUB_KEY=your_finnhub_api_key
```

Get your free Finnhub API key at: https://finnhub.io/

### Running the App

```bash
# Development
npm run dev

# Production Build
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── finance/          # Stock, chart, news widgets
│   ├── layout/           # Dashboard grid, sidebar, topbar
│   └── sports/           # Match predictions, form table, scores
├── hooks/
│   ├── useStockData.js   # Finnhub API integration
│   └── useSportsData.js  # Sports data & predictions
├── services/
│   ├── predictions.js     # Stock signal generation
│   └── stockAPI.js        # Finnhub API calls
├── store/
│   └── dashboardStore.js  # Zustand global state
├── utils/
│   └── predictions.js     # Signal calculations
├── App.jsx
└── main.jsx
```

## API Limitations

- **Finnhub**: Free tier provides real-time quotes for US stocks
- **TheSportsDB**: Free tier has a known issue returning identical data for all leagues. Match predictions use mock data with real team names to ensure variety.

## Design

Dark theme optimized dashboard with:
- Background: `#0a0a0f`
- Card Background: `#13131a`
- Accent Color: `#00ff9d`
- Fonts: Space Mono (data), Syne (headings)

## License

MIT
