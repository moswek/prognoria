# PROGNORIA

A professional predictive analytics dashboard for Finance and Stock Market trading. Built with React, Vite, and Tailwind CSS.

![Prognoria](https://img.shields.io/badge/Prognoria-Predictive%20Analytics-00ff9d?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0-646cff?style=flat-square&logo=vite)

## Features

### Stock Signals
- Real-time buy/sell/hold recommendations for major stocks
- Entry zones, exit targets, and stop loss levels
- Risk assessment and confidence scores
- Quick trade execution from signals

### Market Ticker
- Live scrolling display of global stock exchange times
- NYSE, LSE, TSE, HKEX, SSE, FWB, ASX, SGX
- Real-time open/closed status based on market hours

### Trading Simulator
- Virtual trading with customizable capital
- Track open positions and trade history
- Win rate and P&L analysis
- Position sizing based on signal recommendations

### Additional Widgets
- **Stock Chart** - Interactive 4-hour timeframe charts with search
- **Trend Predictor** - Technical analysis (RSI, momentum, support/resistance)
- **News Widget** - Latest market news
- **Watchlist** - Track favorite stocks

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Phosphor Icons
- **APIs**: Finnhub (Stocks)

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
│   ├── finance/          # Stock, chart, news, trading widgets
│   └── layout/          # Dashboard grid, sidebar, topbar
├── hooks/
│   └── useStockData.js  # Stock data & Finnhub API
├── services/
│   ├── predictions.js   # Signal generation
│   └── stockAPI.js      # Finnhub API calls
├── store/
│   ├── dashboardStore.js  # Widget state
│   └── tradeStore.js      # Trade simulation state
├── utils/
│   └── notifications.js   # Sound & browser notifications
├── App.jsx
└── main.jsx
```

## Design

Dark theme optimized dashboard with:
- Background: `#0a0a0f`
- Card Background: `#13131a`
- Accent Color: `#00ff9d`
- Fonts: Space Mono (data), Syne (headings)

## License

MIT
