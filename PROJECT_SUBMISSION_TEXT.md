# TerraTrend — NASA Space Apps Challenge 2026

**Selected challenge:** Be An Earth System Trend Detective!

## Summary draft

TerraTrend is an interactive environmental data explorer that helps users investigate long-term changes in Earth-system conditions. Users select a location, indicator, and study period, then analyze monthly NASA POWER data converted into complete annual values. The application visualizes annual patterns and a fitted linear trend, reports the estimated rate of change per decade, and presents a conventional statistical test and confidence interval. Its **Same planet. Different signals.** feature compares the same indicator across two locations over shared complete years. Users can inspect the original NASA data request and export annual values for further analysis.

## Method and data

Data source: NASA POWER Monthly Point API. Supported parameters: T2M, PRECTOTCORR, RH2M, WS10M, and ALLSKY_SFC_SW_DWN. Annual means are calendar-day-weighted; annual precipitation is calculated from monthly mean daily rates multiplied by calendar-month days. Incomplete years are excluded. Ordinary least squares estimates the linear trend; the displayed p-value and 95% confidence interval use a conventional t-based method.

## Limitations to disclose

NASA POWER values are gridded estimates, not local weather-station measurements at the exact selected coordinate. The classical regression test assumes independent residuals, so serial correlation can affect significance. The location comparison is descriptive and does not test the difference between slopes. The application does not establish causation or make forecasts.

## Submission checks

- Confirm that the deployed Cloudflare Pages site retrieves genuine NASA POWER records for at least one location and variable.
- Confirm the original NASA request link and CSV export refer to the same retrieved data.
- Upload a demonstration recorded from the final deployed application.
- Complete the NASA form's Super Intelligence disclosure accurately for all AI-assisted code, text, images, and video used.
- Verify third-party asset permissions and comply with the official event rules before final submission.

Do not claim that live deployment, every variable, or every calculation has been verified until those checks have actually been completed.