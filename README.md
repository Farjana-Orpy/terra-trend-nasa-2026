# TerraTrend

An interactive environmental data explorer for investigating long-term Earth-system changes with NASA POWER data.

## What it does

- Select a location from the built-in list, the map, or custom coordinates.
- Analyze air temperature, precipitation, relative humidity, wind speed, and surface solar irradiance.
- Convert monthly NASA POWER records into complete annual values and visualize the time series with a fitted trend line.
- Report the estimated change per decade, fitted change across the study period, a conventional two-sided slope test, and a 95% confidence interval.
- Compare two locations over the same indicator and overlapping complete years in **Same planet. Different signals.**
- Export annual values as CSV, copy findings, or print the analysis.

## Data and scientific methods

TerraTrend uses the NASA POWER Monthly Point API. The application links each result to the corresponding original NASA request. NASA POWER provides gridded Earth-science estimates; values are not direct weather-station readings at every selected coordinate.

Monthly values are aggregated into annual values. Temperature, relative humidity, wind speed, and solar irradiance use calendar-day-weighted annual means. Corrected precipitation is a monthly mean daily rate, so annual precipitation is calculated by multiplying each monthly rate by the number of days in that month and summing the results. Incomplete calendar years are excluded.

Ordinary least squares estimates a linear trend. The displayed p-value and 95% confidence interval use a conventional t-based calculation that assumes independent residuals. Serial correlation can make the reported significance too optimistic. The two-location view is descriptive and does not test whether the difference between slopes is statistically significant. No causal claim or forecast is made.

See METHODS.md for variable definitions, aggregation, assumptions, and limitations.

## Cloudflare Pages deployment

This repository is prepared for Cloudflare Pages Git integration. The NASA data proxy is a Pages Function at functions/api/power.js. It forwards validated requests to the fixed NASA POWER endpoint; no database, secret, or API key is required.

1. In Cloudflare, open Workers & Pages → Create application → Pages → Connect to Git.
2. Select the GitHub repository Farjana-Orpy/terra-trend-nasa-2026 and production branch main.
3. Choose no framework preset. Set Build command to exit 0 and Build output directory to . (the repository root). Leave Root directory blank.
4. Keep environment variables empty and select Save and Deploy.
5. Open the generated pages.dev URL and test a real NASA POWER analysis. Detailed instructions are in CLOUDFLARE_PAGES_SETUP.md.

Do not create this as a Worker using the Workers Builds form. Choose the Pages product because this repository uses Pages Functions.

## Repository files

- index.html, styles.css: public interface and visual design.
- app.js: user interactions, NASA data retrieval, charts, comparisons, and exports.
- science.js: monthly-to-annual aggregation and statistical calculations.
- functions/api/power.js: Cloudflare Pages Function for NASA POWER requests.
- METHODS.md: data provenance, calculations, and scientific limitations.
- PROJECT_SUBMISSION_TEXT.md: draft text for the NASA project form; verify all claims against the deployed site before submitting.

## Attribution and independence

NASA POWER data and documentation are attributed to NASA. The map geometry is from Natural Earth and is public domain. TerraTrend is an independent project and is not affiliated with or endorsed by NASA. The MIT license applies to original project code and documentation; external data and third-party assets retain their own terms.