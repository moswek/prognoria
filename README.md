
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rm {
    background: #0a0a0f;
    color: #c8c8d4;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    line-height: 1.7;
    padding: 2.5rem 2rem;
    border-radius: 12px;
  }

  .rm-hero {
    border-bottom: 1px solid #1e1e2e;
    padding-bottom: 2rem;
    margin-bottom: 2rem;
  }

  .rm-logo {
    font-family: 'Syne', sans-serif;
    font-size: 2.6rem;
    font-weight: 700;
    color: #00ff9d;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .rm-tagline {
    font-size: 12px;
    color: #6b6b8a;
    margin-top: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .rm-badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 1.25rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #13131a;
    border: 1px solid #2a2a3e;
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 11px;
    color: #8888aa;
  }
  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00ff9d;
    flex-shrink: 0;
  }
  .badge-dot.react { background: #61dafb; }
  .badge-dot.vite { background: #646cff; }

  .rm-section {
    margin-bottom: 2.25rem;
  }

  .rm-h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #00ff9d;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 1.1rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .rm-h2::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #1e1e2e;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
  }

  .feat-card {
    background: #13131a;
    border: 1px solid #1e1e2e;
    border-radius: 8px;
    padding: 1rem 1.1rem;
  }

  .feat-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: #e0e0f0;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .feat-icon {
    width: 18px;
    height: 18px;
    background: #00ff9d18;
    border: 1px solid #00ff9d33;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .feat-icon svg {
    width: 10px;
    height: 10px;
    fill: #00ff9d;
  }

  .feat-list {
    list-style: none;
    padding: 0;
  }

  .feat-list li {
    font-size: 12px;
    color: #6b6b8a;
    padding: 2px 0;
    padding-left: 12px;
    position: relative;
  }

  .feat-list li::before {
    content: '—';
    position: absolute;
    left: 0;
    color: #2e2e4a;
  }

  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 8px;
  }

  .tech-item {
    background: #13131a;
    border: 1px solid #1e1e2e;
    border-radius: 6px;
    padding: 0.7rem 0.9rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tech-label {
    font-size: 11px;
    color: #6b6b8a;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .tech-value {
    font-size: 12px;
    color: #c8c8d4;
  }

  .code-block {
    background: #0d0d16;
    border: 1px solid #1e1e2e;
    border-radius: 6px;
    padding: 1rem 1.1rem;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: #8888aa;
    overflow-x: auto;
    margin-bottom: 0.75rem;
    white-space: pre;
  }

  .code-block .c { color: #6b6b8a; }
  .code-block .cmd { color: #00ff9d; }
  .code-block .str { color: #f4c542; }
  .code-block .key { color: #61dafb; }

  .env-block {
    background: #0d0d16;
    border: 1px solid #1e1e2e;
    border-left: 2px solid #00ff9d;
    border-radius: 0 6px 6px 0;
    padding: 0.9rem 1.1rem;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    margin-bottom: 0.5rem;
  }

  .env-key { color: #61dafb; }
  .env-val { color: #f4c542; }

  .env-note {
    font-size: 11px;
    color: #6b6b8a;
    margin-top: 0.5rem;
  }

  .env-note a { color: #00ff9d; text-decoration: none; }

  .tree-block {
    background: #0d0d16;
    border: 1px solid #1e1e2e;
    border-radius: 6px;
    padding: 1rem 1.1rem;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: #6b6b8a;
    line-height: 1.9;
    white-space: pre;
    overflow-x: auto;
  }

  .tree-block .dir { color: #00ff9d; }
  .tree-block .file { color: #8888aa; }
  .tree-block .comment { color: #3a3a5a; }

  .design-palette {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }

  .swatch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .swatch-box {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    border: 1px solid #2a2a3e;
  }

  .swatch-label {
    font-size: 10px;
    color: #6b6b8a;
    text-align: center;
    line-height: 1.3;
  }

  .font-sample {
    margin-top: 0.75rem;
    display: flex;
    gap: 1.5rem;
    align-items: baseline;
  }

  .font-a {
    font-family: 'Space Mono', monospace;
    font-size: 22px;
    color: #c8c8d4;
  }

  .font-b {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: #e0e0f0;
  }

  .font-meta {
    font-size: 10px;
    color: #4a4a6a;
    display: block;
  }

  .license-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .license-tag {
    background: #13131a;
    border: 1px solid #2a2a3e;
    border-radius: 4px;
    padding: 3px 10px;
    font-size: 11px;
    color: #00ff9d;
    font-family: 'Space Mono', monospace;
  }

  .divider {
    height: 1px;
    background: #1e1e2e;
    margin: 2rem 0;
  }

  .steps {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .step {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .step-num {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid #2a2a3e;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #00ff9d;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .step-content {
    flex: 1;
  }

  .step-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #e0e0f0;
    margin-bottom: 4px;
  }
</style>

<div class="rm">

  <!-- HERO -->
  <div class="rm-hero">
    <div class="rm-logo">PROGNORIA</div>
    <div class="rm-tagline">Predictive Analytics Dashboard — Finance &amp; Stock Market</div>
    <div class="rm-badges">
      <span class="badge"><span class="badge-dot"></span>Prognoria · Predictive Analytics</span>
      <span class="badge"><span class="badge-dot react"></span>React 19.2</span>
      <span class="badge"><span class="badge-dot vite"></span>Vite 8.0</span>
    </div>
  </div>

  <!-- FEATURES -->
  <div class="rm-section">
    <div class="rm-h2">Features</div>
    <div class="features-grid">

      <div class="feat-card">
        <div class="feat-title">
          <div class="feat-icon"><svg viewBox="0 0 10 10"><polyline points="1,7 3,4 5,6 7,2 9,4" fill="none" stroke="#00ff9d" stroke-width="1.5"/></svg></div>
          Stock Signals
        </div>
        <ul class="feat-list">
          <li>Buy / sell / hold recommendations</li>
          <li>Entry zones, targets &amp; stop loss</li>
          <li>Risk assessment &amp; confidence scores</li>
          <li>Quick trade execution from signals</li>
        </ul>
      </div>

      <div class="feat-card">
        <div class="feat-title">
          <div class="feat-icon"><svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="3" fill="none" stroke="#00ff9d" stroke-width="1.5"/><line x1="5" y1="1" x2="5" y2="2.5" stroke="#00ff9d" stroke-width="1.5"/></svg></div>
          Market Ticker
        </div>
        <ul class="feat-list">
          <li>Live scrolling global exchange times</li>
          <li>NYSE, LSE, TSE, HKEX, SSE &amp; more</li>
          <li>Real-time open / closed status</li>
        </ul>
      </div>

      <div class="feat-card">
        <div class="feat-title">
          <div class="feat-icon"><svg viewBox="0 0 10 10"><rect x="1" y="5" width="2" height="4" fill="#00ff9d"/><rect x="4" y="3" width="2" height="6" fill="#00ff9d"/><rect x="7" y="1" width="2" height="8" fill="#00ff9d"/></svg></div>
          Trading Simulator
        </div>
        <ul class="feat-list">
          <li>Virtual trading, customizable capital</li>
          <li>Open positions &amp; trade history</li>
          <li>Win rate &amp; P&amp;L analysis</li>
          <li>Signal-based position sizing</li>
        </ul>
      </div>

      <div class="feat-card">
        <div class="feat-title">
          <div class="feat-icon"><svg viewBox="0 0 10 10"><rect x="1" y="1" width="3.5" height="3.5" rx="1" fill="#00ff9d"/><rect x="5.5" y="1" width="3.5" height="3.5" rx="1" fill="#00ff9d"/><rect x="1" y="5.5" width="3.5" height="3.5" rx="1" fill="#00ff9d"/><rect x="5.5" y="5.5" width="3.5" height="3.5" rx="1" fill="#00ff9d"/></svg></div>
          Additional Widgets
        </div>
        <ul class="feat-list">
          <li>Stock chart — 4h timeframe + search</li>
          <li>Trend predictor — RSI, momentum</li>
          <li>News widget — latest market news</li>
          <li>Watchlist — track favourites</li>
        </ul>
      </div>

    </div>
  </div>

  <!-- TECH STACK -->
  <div class="rm-section">
    <div class="rm-h2">Tech Stack</div>
    <div class="tech-grid">
      <div class="tech-item"><span class="tech-label">Frontend</span><span class="tech-value">React 19, Vite</span></div>
      <div class="tech-item"><span class="tech-label">Styling</span><span class="tech-value">Tailwind CSS</span></div>
      <div class="tech-item"><span class="tech-label">State</span><span class="tech-value">Zustand</span></div>
      <div class="tech-item"><span class="tech-label">Charts</span><span class="tech-value">Recharts</span></div>
      <div class="tech-item"><span class="tech-label">Icons</span><span class="tech-value">Phosphor Icons</span></div>
      <div class="tech-item"><span class="tech-label">APIs</span><span class="tech-value">Finnhub (Stocks)</span></div>
    </div>
  </div>

  <!-- GETTING STARTED -->
  <div class="rm-section">
    <div class="rm-h2">Getting Started</div>

    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-content">
          <div class="step-title">Prerequisites</div>
          <div class="code-block"><span class="key">Node.js</span> 18+   <span class="key">npm</span> or <span class="key">yarn</span></div>
        </div>
      </div>

      <div class="step">
        <div class="step-num">2</div>
        <div class="step-content">
          <div class="step-title">Installation</div>
          <div class="code-block"><span class="c"># Clone the repository</span>
<span class="cmd">git clone</span> https://github.com/moswek/prognoria.git
<span class="cmd">cd</span> prognoria

<span class="c"># Install dependencies</span>
<span class="cmd">npm install</span>

<span class="c"># Create .env from example</span>
<span class="cmd">cp</span> .env.example .env</div>
        </div>
      </div>

      <div class="step">
        <div class="step-num">3</div>
        <div class="step-content">
          <div class="step-title">Environment Variables</div>
          <div class="env-block"><span class="env-key">VITE_FINNHUB_KEY</span>=<span class="env-val">your_finnhub_api_key</span></div>
          <div class="env-note">Get a free key at <a href="https://finnhub.io/" target="_blank">finnhub.io</a></div>
        </div>
      </div>

      <div class="step">
        <div class="step-num">4</div>
        <div class="step-content">
          <div class="step-title">Run the App</div>
          <div class="code-block"><span class="c"># Development</span>
<span class="cmd">npm run dev</span>

<span class="c"># Production</span>
<span class="cmd">npm run build</span>
<span class="cmd">npm run preview</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- PROJECT STRUCTURE -->
  <div class="rm-section">
    <div class="rm-h2">Project Structure</div>
    <div class="tree-block"><span class="dir">src/</span>
├── <span class="dir">components/</span>
│   ├── <span class="dir">finance/</span>          <span class="comment"># Stock, chart, news, trading widgets</span>
│   └── <span class="dir">layout/</span>           <span class="comment"># Dashboard grid, sidebar, topbar</span>
├── <span class="dir">hooks/</span>
│   └── <span class="file">useStockData.js</span>   <span class="comment"># Stock data &amp; Finnhub API</span>
├── <span class="dir">services/</span>
│   ├── <span class="file">predictions.js</span>    <span class="comment"># Signal generation</span>
│   └── <span class="file">stockAPI.js</span>       <span class="comment"># Finnhub API calls</span>
├── <span class="dir">store/</span>
│   ├── <span class="file">dashboardStore.js</span> <span class="comment"># Widget state</span>
│   └── <span class="file">tradeStore.js</span>     <span class="comment"># Trade simulation state</span>
├── <span class="dir">utils/</span>
│   └── <span class="file">notifications.js</span>  <span class="comment"># Sound &amp; browser notifications</span>
├── <span class="file">App.jsx</span>
└── <span class="file">main.jsx</span></div>
  </div>

  <!-- DESIGN -->
  <div class="rm-section">
    <div class="rm-h2">Design</div>
    <div style="font-size:12px; color:#6b6b8a; margin-bottom:1rem;">Dark theme optimised dashboard.</div>
    <div class="design-palette">
      <div class="swatch">
        <div class="swatch-box" style="background:#0a0a0f;"></div>
        <span class="swatch-label">Background<br>#0a0a0f</span>
      </div>
      <div class="swatch">
        <div class="swatch-box" style="background:#13131a;"></div>
        <span class="swatch-label">Card BG<br>#13131a</span>
      </div>
      <div class="swatch">
        <div class="swatch-box" style="background:#00ff9d; border-color:#00ff9d;"></div>
        <span class="swatch-label">Accent<br>#00ff9d</span>
      </div>
    </div>
    <div class="font-sample">
      <div>
        <span class="font-a">Aa</span>
        <span class="font-meta">Space Mono — data</span>
      </div>
      <div>
        <span class="font-b">Aa</span>
        <span class="font-meta">Syne — headings</span>
      </div>
    </div>
  </div>

  <!-- LICENSE -->
  <div class="divider"></div>
  <div class="license-row">
    <span class="license-tag">MIT</span>
    <span style="font-size:12px; color:#4a4a6a;">Open source. Use freely.</span>
  </div>

</div>
