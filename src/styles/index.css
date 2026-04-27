:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color-scheme: light;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
}

button,
input {
  font: inherit;
}

button {
  border: 0;
}

.app-root {
  min-height: 100vh;
  color: #0f2545;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
  transition: background 0.2s ease, color 0.2s ease;
}

.app-root.dark {
  color: #e5efff;
  background: radial-gradient(circle at top left, #10213f 0%, #081121 40%, #050914 100%);
}

.dashboard-shell {
  width: min(100%, 1360px);
  margin: 0 auto;
  padding: 28px;
}

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.dashboard-header h1 {
  margin: 0 0 8px;
  font-size: clamp(2rem, 3vw, 2.45rem);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #0f2545;
}

.dashboard-header p {
  margin: 0;
  font-size: 1rem;
  color: #334e72;
}

.dark .dashboard-header h1,
.dark .dashboard-header p {
  color: #f8fbff;
}

.header-actions,
.vault-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.ghost-button,
.small-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  border-radius: 12px;
  padding: 0 14px;
  color: #213754;
  background: #ffffff;
  border: 1px solid #dbe5f1;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.ghost-button:hover,
.small-button:hover {
  transform: translateY(-1px);
  border-color: #b9cde8;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.11);
}

.small-button.primary {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.small-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.dark .ghost-button,
.dark .small-button {
  color: #e5efff;
  background: #111c31;
  border-color: #263955;
  box-shadow: none;
}

.vault-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 22px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(214, 226, 241, 0.9);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.07);
}

.dark .vault-card,
.dark .panel,
.dark .config-card {
  background: rgba(13, 24, 44, 0.92);
  border-color: #263955;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.28);
}

.vault-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 170px;
  font-weight: 700;
  color: #183353;
}

.dark .vault-title {
  color: #e5efff;
}

.vault-controls input {
  width: min(310px, 72vw);
  height: 40px;
  border-radius: 12px;
  border: 1px solid #bfd0e5;
  padding: 0 12px;
  color: #0f2545;
  background: #ffffff;
}

.vault-hint {
  width: 100%;
  margin: -4px 0 0;
  color: #61718a;
  font-size: 0.86rem;
}

.dark .vault-hint {
  color: #9fb0ca;
}

.notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 22px;
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 0.94rem;
  line-height: 1.4;
}

.notice.success {
  color: #087a37;
  background: #e8fff0;
  border: 1px solid #b4f0ca;
}

.notice.error {
  color: #b42318;
  background: #fff0f0;
  border: 1px solid #fecaca;
}

.notice.info {
  color: #1d4ed8;
  background: #eef6ff;
  border: 1px solid #bfdbfe;
}

.config-grid,
.metric-grid,
.main-grid,
.summary-grid {
  display: grid;
  gap: 24px;
}

.config-grid,
.metric-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 32px;
}

.config-card,
.panel {
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #eef3f9;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.11);
}

.config-card {
  padding: 24px;
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.card-heading.compact {
  margin-bottom: 10px;
}

.card-heading span {
  display: block;
  margin-bottom: 4px;
  color: #344966;
  font-size: 0.91rem;
}

.card-heading strong {
  display: block;
  color: #0d1f3a;
  font-size: 1.75rem;
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.config-card input,
.panel input,
.vault-controls input {
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.config-card input {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 1px solid #c5d4e7;
  padding: 0 15px;
  color: #10233f;
  background: #ffffff;
}

.config-card input:focus,
.vault-controls input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.17);
}

.icon-box,
.solid-icon {
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 12px;
}

.icon-box.purple {
  color: #9333ea;
  background: #f1ddff;
}

.icon-box.blue {
  color: #2563eb;
  background: #dbeafe;
}

.icon-box.orange {
  color: #f97316;
  background: #ffedd5;
}

.icon-box.teal {
  color: #0d9488;
  background: #ccfbf1;
}

.calculated-card {
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.10);
  border: 2px solid transparent;
}

.calculated-card .solid-icon {
  color: #ffffff;
}

.calculated-card p {
  margin: 0;
  color: #334e72;
  font-size: 0.82rem;
  line-height: 1.4;
}

.calculated-card.blue {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-color: #bfdbfe;
}

.calculated-card.blue .solid-icon { background: #2563eb; }
.calculated-card.blue strong { color: #1d4ed8; }

.calculated-card.green {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-color: #bbf7d0;
}

.calculated-card.green .solid-icon { background: #16a34a; }
.calculated-card.green strong { color: #087a37; }

.calculated-card.emerald {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-color: #a7f3d0;
}

.calculated-card.emerald .solid-icon { background: #059669; }
.calculated-card.emerald strong { color: #047857; }

.calculated-card.indigo {
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  border-color: #c7d2fe;
}

.calculated-card.indigo .solid-icon { background: #4f46e5; }
.calculated-card.indigo strong { color: #3730a3; font-size: 1.32rem; }

.calculated-card.red {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border-color: #fecaca;
}

.calculated-card.red .solid-icon { background: #dc2626; }
.calculated-card.red strong { color: #b91c1c; }

.main-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  margin-bottom: 32px;
}

.panel {
  padding: 32px;
}

.panel h2 {
  margin: 0 0 24px;
  text-align: center;
  color: #0d1f3a;
  font-size: 1.65rem;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.transactions-panel h2 {
  text-align: left;
}

.chart-wrapper {
  min-height: 390px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recharts-wrapper svg {
  overflow: visible;
}

.chart-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 22px;
  text-align: center;
}

.summary-panel h2 {
  text-align: left;
  font-size: 1.4rem;
}

.summary-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 26px;
}

.summary-item span {
  display: block;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 0.88rem;
}

.summary-item strong {
  display: block;
  color: #0d1f3a;
  font-size: 1.5rem;
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.summary-item.red strong { color: #ef4444; }
.summary-item.orange strong { color: #f59e0b; }
.summary-item.green strong { color: #10b981; }
.summary-item.blue strong { color: #2563eb; }
.summary-item.purple strong { color: #9333ea; }

.upload-zone {
  height: 132px;
  border-radius: 14px;
  border: 2px dashed #c7d5e9;
  background: #f8fbff;
  color: #97a6bb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.upload-zone:hover,
.upload-zone.processing {
  border-color: #60a5fa;
  background: #eff6ff;
  color: #2563eb;
}

.upload-zone strong {
  color: #10233f;
  font-size: 0.95rem;
}

.upload-zone span {
  color: #49617e;
  font-size: 0.82rem;
}

.upload-zone input {
  display: none;
}

.transaction-list {
  max-height: 420px;
  overflow: auto;
  margin-top: 24px;
  padding-right: 4px;
}

.transaction-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: start;
  gap: 12px;
  padding: 14px;
  border-radius: 13px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  margin-bottom: 12px;
}

.transaction-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  color: #dc2626;
  background: #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transaction-body strong {
  display: block;
  color: #0d1f3a;
  font-weight: 800;
}

.transaction-body span,
.transaction-body small {
  display: block;
  margin-top: 3px;
  color: #64748b;
  font-size: 0.82rem;
  word-break: break-word;
}

.transaction-value {
  white-space: nowrap;
  color: #dc2626;
  font-weight: 800;
  font-size: 1.08rem;
}

.transaction-item button {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: #94a3b8;
  background: transparent;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
}

.transaction-item button:hover {
  color: #dc2626;
  background: #fee2e2;
}

.empty-state,
.empty-chart-ring {
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-state {
  min-height: 230px;
  gap: 8px;
}

.empty-state strong {
  color: #64748b;
}

.empty-state span {
  font-size: 0.9rem;
}

.empty-chart-ring {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  border: 52px solid #edf2f8;
  padding: 18px;
  font-weight: 700;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.dark .dashboard-header h1,
.dark .panel h2,
.dark .card-heading strong,
.dark .transaction-body strong,
.dark .summary-item strong,
.dark .upload-zone strong {
  color: #f8fbff;
}

.dark .dashboard-header p,
.dark .card-heading span,
.dark .summary-item span,
.dark .transaction-body span,
.dark .transaction-body small,
.dark .calculated-card p,
.dark .upload-zone span {
  color: #a7b7cf;
}

.dark .config-card input,
.dark .vault-controls input {
  color: #f8fbff;
  background: #0b1426;
  border-color: #324560;
}

.dark .upload-zone,
.dark .transaction-item {
  background: #0b1426;
  border-color: #324560;
}

.dark .empty-chart-ring {
  border-color: #17243a;
  color: #a7b7cf;
}

.dark .calculated-card.blue { background: linear-gradient(135deg, rgba(37, 99, 235, 0.16), rgba(29, 78, 216, 0.11)); }
.dark .calculated-card.green { background: linear-gradient(135deg, rgba(22, 163, 74, 0.16), rgba(21, 128, 61, 0.11)); }
.dark .calculated-card.emerald { background: linear-gradient(135deg, rgba(5, 150, 105, 0.17), rgba(4, 120, 87, 0.11)); }
.dark .calculated-card.indigo { background: linear-gradient(135deg, rgba(79, 70, 229, 0.17), rgba(67, 56, 202, 0.11)); }
.dark .calculated-card.red { background: linear-gradient(135deg, rgba(220, 38, 38, 0.17), rgba(185, 28, 28, 0.11)); }

@media (max-width: 1180px) {
  .config-grid,
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .main-grid,
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .dashboard-shell {
    padding: 18px;
  }

  .dashboard-header {
    flex-direction: column;
  }

  .config-grid,
  .metric-grid,
  .chart-summary {
    grid-template-columns: 1fr;
  }

  .panel,
  .config-card,
  .calculated-card {
    padding: 20px;
  }

  .transaction-item {
    grid-template-columns: auto 1fr;
  }

  .transaction-value,
  .transaction-item button {
    grid-column: 2;
    justify-self: start;
  }
}
