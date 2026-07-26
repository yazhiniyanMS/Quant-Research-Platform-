# QuantLab — Integrated Factor Research & Portfolio Construction Platform

QuantLab unifies two institutional-grade engines into a single application and
runs a complete, look-ahead-safe study — from raw data to a costed backtest and a
risk report — in one command.

```
data ─▶ MFRP factor engine ─▶ composite score + IC diagnostics
     └▶ FactorSelectionStrategy (alpha)  ×  PCE optimiser (risk)
        └▶ PCE walk-forward backtest (costs · turnover · benchmark)
           └▶ PCE risk analytics (VaR/CVaR · drawdown · stress · beta)
              └▶ HTML / CSV reports
```

The design principle is the way a real equity desk is organised: **the signal
team decides *what* to hold, the portfolio-construction team decides *how much*.**

* **`quantlab.mfrp`** — Multi-Factor Research Platform (~15.8k LOC): data layer,
  factor library (value / momentum / quality / low-vol / risk), and
  cross-sectional research (Information Coefficient, quantile spreads,
  Fama–MacBeth). *Answers "which names look attractive?"*
* **`quantlab.pce`** — Portfolio-Construction Engine (~7.5k LOC): covariance
  estimation, convex optimisers (min-variance, max-Sharpe, risk-parity,
  Black–Litterman), a walk-forward backtester with a transaction-cost model, and
  a deep risk-analytics suite. *Answers "how much of each, and how risky is it?"*
* **`quantlab.integration`** — the thin bridge that joins them.

> These two engines arrived as eight separate archives. See
> [`docs/CODE_REVIEW.md`](docs/CODE_REVIEW.md) for how they were combined, the
> bugs found along the way, and the backtest interpretation.

---

## Quick start

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Run the full combined study from the CLI
PYTHONPATH=src python -m quantlab run --sizing min_variance --rebalance Q --years 8

# …or from Python
PYTHONPATH=src python - <<'PY'
from quantlab import QuantLabPlatform, CombinedConfig
result = QuantLabPlatform(CombinedConfig(sizing="min_variance")).run()
print(result.summary)
print("IC:", result.ic_stats)
PY

# …or the annotated example (adds a rebalance-frequency sensitivity)
PYTHONPATH=src python examples/run_combined_backtest.py

# …or the interactive dashboard
PYTHONPATH=src streamlit run dashboard/app.py
```

No internet is required: the platform ships a deterministic offline synthetic
market. Swap `quantlab.data.generate_market` for a real loader (`yfinance`, the
bundled `quantlab.mfrp.data` stack, FRED, SEC EDGAR, …) without touching anything
downstream.

---

## Example output

40-name universe, 8 years, monthly rebalance, 10 bps round-trip cost:

| Strategy | CAGR | Sharpe | Max DD | Ann. turnover | Cost drag |
|---|---:|---:|---:|---:|---:|
| Min Variance (all) | 7.52% | **0.44** | −21.1% | 2.0× | 1.4% |
| Factor + Min Variance | 7.12% | 0.38 | −24.8% | 7.1× | 4.9% |
| Risk Parity (all) | 7.24% | 0.36 | −29.6% | 0.7× | 0.5% |
| Equal-Weight (B&H) | 7.27% | 0.35 | −31.3% | 0.6× | 0.5% |

The factor signal is genuine (name-level score↔alpha ρ ≈ 0.45) but naive monthly
rebalancing churns the book ~7×/yr; the cost drag cancels the alpha. Cutting to
quarterly halves turnover and lifts net Sharpe — see
[`docs/PROJECT_REPORT.md`](docs/PROJECT_REPORT.md).

---

## Project layout

```
quantlab-quant-platform/
├── src/quantlab/
│   ├── mfrp/              # vendored Multi-Factor Research Platform
│   ├── pce/              # vendored Portfolio-Construction Engine
│   ├── data/            # unified offline synthetic market generator
│   ├── integration/    # the bridge: strategy.py + orchestrator.py
│   ├── utils/          # shared logging
│   └── cli.py          # `python -m quantlab`
├── dashboard/app.py    # Streamlit UI
├── examples/           # runnable demonstrations
├── tests/              # mfrp/ (340) + pce/ (79) + integration/ (11) = 430 tests
├── reports/            # generated HTML / CSV artefacts
└── docs/               # CODE_REVIEW · FINANCE_THEORY · DEVELOPER_GUIDE ·
                        # LEARNING_GUIDE · PROJECT_REPORT
```

## Tests

```bash
PYTHONPATH=src pytest            # 430 passing
PYTHONPATH=src pytest tests/integration
```

## Documentation

| File | For |
|---|---|
| [`docs/PROJECT_REPORT.md`](docs/PROJECT_REPORT.md) | The study, results, interpretation |
| [`docs/CODE_REVIEW.md`](docs/CODE_REVIEW.md) | Review of both codebases + integration decisions |
| [`docs/FINANCE_THEORY.md`](docs/FINANCE_THEORY.md) | The intuition and mathematics behind every model |
| [`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md) | Architecture, extension points, data-source swap |
| [`docs/LEARNING_GUIDE.md`](docs/LEARNING_GUIDE.md) | A guided path through the codebase for study |

## License

MIT — see [`LICENSE`](LICENSE). Synthetic data only; not investment advice.
