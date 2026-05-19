# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is the **SIAB (Startup in a Box)** marketing and intake platform — a single-page application for a startup services company targeting non-technical founders. The entire product is a single `index.html` file with embedded CSS and JavaScript; there is no build system, no dependencies, and no package manager.

## Development

Open `index.html` directly in a browser — no server required. Any text editor works. There are no build steps, no compilation, and no test suite.

## Architecture

Everything lives in `index.html`:

- **CSS** (lines 10–810): Uses CSS custom properties defined in `:root` for the design system (colors, fonts, radii). Two typefaces: `Syne` (headings) and `DM Sans` (body), loaded from Google Fonts. Dark-only theme.
- **HTML** (lines 812–1274): Five sections with anchor IDs — `#how`, `#wizard`, `#pricing`, `#roadmap`, `#cta` — plus a fixed `<nav>` and `<footer>`.
- **JavaScript** (lines 1276–1402): Vanilla JS, no frameworks. Three concerns:
  - **Chip toggles** — multi-select (`industry-chips`, `tech-chips`, `services-chips`) vs. single-select (`budget-chips`) groups.
  - **Wizard navigation** — `goStep(n)` swaps `.active` on `.form-panel` and `.wstep` elements; `currentStep` tracks state.
  - **AI report simulation** — `runAnalysis()` computes a viability score from form inputs and renders results into `#panel-4`; no real API calls.
  - **Timeline animation** — `IntersectionObserver` adds `.visible` class to `.tl-item` elements as they scroll into view.

## Design system tokens

| Token | Value | Use |
|---|---|---|
| `--accent` | `#c8f04a` | Primary CTA, highlights |
| `--accent2` | `#7c6aff` | Focus states, gradient |
| `--accent3` | `#ff6a3d` | Equity/Tier 4 highlights |
| `--bg` / `--bg2` / `--bg3` | Dark grays | Section backgrounds |
| `--font-head` | Syne | All headings (`h1`–`h3`, `.pricing-name`) |
| `--font-body` | DM Sans | Body text, inputs, buttons |

## Pricing tiers (referenced in JS logic)

- **Tier 1 — The Blueprint**: $250–$500 one-time
- **Tier 2 — The Launchpad**: $5k–$15k (most popular, `featured` card)
- **Tier 3 — The Scale Engine**: $2.5k/mo retainer
- **Tier 4 — Co-Founder Circle**: 7–15% equity

The `runAnalysis()` function maps the selected budget chip to a recommended tier.
