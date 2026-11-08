# Terra Trend — NASA Space Apps Challenge 2026

This repository contains the complete static website source and supporting science/project documents. `index.html` must be at the repository root for GitHub Pages.

## Current project status

- Offline demonstration mode and interactive controls passed previous automated browser tests. Illustrative data are **synthetic** and are never NASA evidence.
- Live NASA POWER mode was tested with simulated API responses, **not yet verified by a genuine NASA request**. Do not claim the live data function is fully tested until you confirm it on your published domain.
- GitHub Pages can host the static website, but **does not support Netlify `_redirects` proxy rules**. This GitHub-specific build calls NASA POWER directly from the browser; external API cross-origin restrictions may prevent the live mode from loading. If so, use a host with an API proxy (such as Netlify with this project's `_redirects` rule) instead of pretending data have been loaded.

## Save and publish with GitHub Pages

1. Create a new **public** repository (suggested name: `terra-trend-nasa-2026`).
2. Extract the ZIP file before uploading, then upload the **contents** of this folder, including `index.html`, `app.js`, `science.js`, `styles.css`, `assets`, and `documentation`. The ZIP itself is not a website entry point.
3. In the GitHub repository, open **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, `main` and `/(root)`, then Save.
4. Open the Visit site link from Pages when deployment finishes; first test offline example, then test **Live NASA POWER**. The site is not scientifically submission-ready until real NASA results and their source URLs are confirmed.

See `documentation/Terra_Trend_A_to_Z_Handbook.pdf` for the complete plain-language explanation.

---

## Original project documentation

# Terra Trend — Verified Browser Build (2026-11-07)

**Purpose:** NASA Space Apps Challenge 2026, “Be An Earth System Trend Detective!”

## START HERE (without coding)

Download `Terra_Trend_FINAL_Open_In_Chrome.html` from the chat, then double-click it to open in Google Chrome or Microsoft Edge. The website starts in **Offline interactive example** mode if opened as a local file. Explore the buttons, map, indicators, years, comparison, and downloads. All example numbers are *synthetic illustrations* and must **never** be submitted as NASA-derived research.

**For real NASA analysis:** Publish `Terra_Trend_FINAL_Ready_To_Publish.zip` via Netlify Drop (https://app.netlify.com/drop) by uploading the extracted folder. Use the publicly hosted HTTPS site, choose **Live NASA POWER**, then click **Analyze NASA data**. The package contains a Netlify `_redirects` rewrite for `/api/power` and a meta flag to use it from custom domains. It still depends on NASA connectivity, Netlify external proxy support, and source availability. Check a live analysis and the source link before submission.

See the on-site **How to use** section for step-by-step explanations of every feature, plus the scientific interpretation of trends and statistical significance.

## INCLUDED

- `index.html`, `styles.css`, `science.js`, `app.js`, `_redirects`, `assets/favicon.svg`: ready-to-host website.
- `VERIFICATION.txt`: checks performed and limitations.
- `README.md`: setup and data ethics.

## VERIFIED TEST RESULTS

Browser interactions tested with Chromium and automated checks: location dropdown and map, coordinate validation, all five indicators, date selection, chart and statistical readout, separate location comparison, CSV export, clipboard, NASA failure recovery, mobile layout. Authentic NASA format tested with simulated JSON responses (a mocked API), not an actual live NASA call. Additional tests check regression mathematics using independent numerical references. Source files have no build dependencies.

## SCIENCE AND DATA ETHICS

- OFFLINE EXAMPLE = synthetic numbers for familiarization. Not NASA observations. Labels are included in UI, reports and downloads.
- LIVE NASA POWER = NASA POWER monthly API; gridded/reanalysis data at selected coordinates, not readings from a physical sensor at the exact city center.
- Annual values are calculated from all 12 calendar months (day-weighted means, annual precipitation is summed from monthly mean daily precipitation × days). Incomplete years are excluded.
- OLS annual trends display slope, approximate two-sided classical t-test p-value, and 95% confidence interval, which assume independent errors and are not a causal test. Use trend comparison as a descriptive contrast only.

NASA POWER docs: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/
Official challenge: https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/

The actual NASA event submission is separate and requires a public URL and the team's own challenge entry. Confirm event participation rules on when work can start.
