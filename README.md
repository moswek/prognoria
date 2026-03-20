<div align="center">

# ⬡ PROGNORIA

**Predictive Analytics Dashboard for Finance & Stock Market Trading**

[![React](https://img.shields.io/badge/React_19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite_8-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-orange?style=flat-square)](https://github.com/pmndrs/zustand)
[![License: MIT](https://img.shields.io/badge/License-MIT-00ff9d?style=flat-square)](./LICENSE)

</div>

---

## ✦ Features

### 📈 Stock Signals
Real-time buy / sell / hold recommendations with entry zones, exit targets, and stop loss levels. Each signal includes a risk assessment score, confidence rating, and a quick-execute button to open a simulated trade directly.

### 🕐 Market Ticker
Live scrolling display of global stock exchange open/closed status — NYSE, LSE, TSE, HKEX, SSE, FWB, ASX, SGX — with real-time status based on actual market hours.

### 🎮 Trading Simulator
Paper-trade with customizable virtual capital. Track open positions, view full trade history, and analyze your win rate and P&L. Position sizing is automatically calculated from signal recommendations.

### 🧩 Additional Widgets

| Widget | Description |
|---|---|
| **Stock Chart** | Interactive 4-hour timeframe charts with symbol search |
| **Trend Predictor** | Technical analysis via RSI, momentum, support & resistance |
| **News Widget** | Latest market news feed |
| **Watchlist** | Track and monitor your favourite stocks |

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Charts | Recharts |
| Icons | Phosphor Icons |
| Data API | Finnhub |

---

## 🚀 Getting Started

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

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Add your API key to `.env`:

```env
VITE_FINNHUB_KEY=your_finnhub_api_key
```

> Get a free Finnhub API key at [finnhub.io](https://finnhub.io)

### Run the App

```bash
# Development server
npm run dev

# Production build
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── finance/          # Stock, chart, news & trading widgets
│   └── layout/           # Dashboard grid, sidebar, topbar
├── hooks/
│   └── useStockData.js   # Stock data & Finnhub API integration
├── services/
│   ├── predictions.js    # Signal generation logic
│   └── stockAPI.js       # Finnhub API calls
├── store/
│   ├── dashboardStore.js # Widget layout state
│   └── tradeStore.js     # Trade simulation state
├── utils/
│   └── notifications.js  # Sound & browser notifications
├── App.jsx
└── main.jsx
```

---

## 🎨 Design

Dark-first dashboard optimised for extended trading sessions.

| Token | Value |
|---|---|
| Background | `#0a0a0f` |
| Card Background | `#13131a` |
| Accent | `#00ff9d` |
| Data Font | Space Mono |
| Heading Font | Syne |

---

## 📄 License

MIT — free to use, modify, and distribute.
