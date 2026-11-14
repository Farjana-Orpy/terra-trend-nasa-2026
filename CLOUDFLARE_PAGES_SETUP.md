# Cloudflare Pages setup for TerraTrend

## Before you start

Your GitHub repository is Farjana-Orpy/terra-trend-nasa-2026. The public website is at the repository root, and the NASA proxy is in the root-level functions/api/power.js directory.

## Create the Pages project

1. Sign in at https://dash.cloudflare.com/.
2. Open Workers & Pages.
3. Choose Create application, then choose the Pages tab.
4. Choose Connect to Git (not the Workers Builds setup).
5. Authorize GitHub if Cloudflare asks, then select Farjana-Orpy/terra-trend-nasa-2026.
6. Name the Cloudflare Pages project terratrend.

## Build settings

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Production branch | main |
| Build command | exit 0 |
| Build output directory | . |
| Root directory | Leave blank |
| Environment variables | None |

Select Save and Deploy. The Pages Function must be included in the repository under functions/api/power.js. Do not use a static ZIP upload that omits Functions.

## Verify the deployment

1. Open the pages.dev URL shown by Cloudflare.
2. Select Sylhet, Air temperature, and a multi-year period.
3. Run Analyze NASA data and wait for a NASA · RETRIEVED or NASA · CACHED status.
4. Open View original NASA data and confirm the source JSON is from power.larc.nasa.gov.
5. Test another variable and the Same planet. Different signals comparison.
6. If the request fails, inspect Cloudflare Pages deployment logs and open the /api/power request URL to see the returned error. Do not claim a live data result until it succeeds.

## Automatic updates

After Git integration is connected, commits pushed to main trigger new production deployments automatically. Pull requests and other branches can create preview deployments.