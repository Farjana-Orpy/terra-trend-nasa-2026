# TerraTrend — Methods, data provenance, and limitations

## NASA POWER source

TerraTrend uses the NASA POWER Monthly Point API at https://power.larc.nasa.gov/api/temporal/monthly/point. The application requests the AG community and one supported parameter at a time. The original NASA request URL is available from each completed analysis.

NASA POWER provides gridded Earth-system estimates derived from satellite observations, atmospheric models, and reanalysis products. These are not physical readings from a weather station at every selected map coordinate. Resolution and source products vary by variable.

| Parameter | Meaning | Annual display |
| --- | --- | --- |
| T2M | 2 m air temperature | °C; calendar-day-weighted mean |
| PRECTOTCORR | Corrected precipitation mean daily rate | mm/year; monthly rate multiplied by days in month, then summed |
| RH2M | Relative humidity at 2 m | %; calendar-day-weighted mean |
| WS10M | Wind speed at 10 m | m/s; calendar-day-weighted mean |
| ALLSKY_SFC_SW_DWN | All-sky surface shortwave irradiance | MJ/m²/day; calendar-day-weighted mean |

NASA documentation: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/

## Annual aggregation

1. Retrieve monthly values for the selected coordinate, parameter, and calendar years.
2. Treat NASA missing-value sentinels and invalid values as missing.
3. Exclude any year that does not contain all 12 valid monthly records.
4. For mean-type variables, calculate the annual value as the sum of (monthly value × calendar days in month) divided by the total calendar days in the year.
5. For PRECTOTCORR, calculate annual precipitation as the sum of (monthly mean daily rate × calendar days in month). Leap years use 29 days for February.

## Trend estimation

Ordinary least squares fits y(year) = intercept + slope × year to the included annual values. The displayed trend per decade is slope × 10. The fitted change across the analyzed period is slope × (last included year − first included year). The interface reports a conventional two-sided Student-t test of slope = 0 and a t-based 95% confidence interval.

## Interpretation and limitations

- A statistically significant fitted slope is not proof of causation.
- A non-significant result does not prove that conditions are stable.
- Classical t-tests and confidence intervals assume independent residuals. Annual environmental series can be autocorrelated, so p-values may be optimistic.
- Linear trends summarize the selected period and may hide nonlinear changes, extremes, or shifts in the underlying data product.
- The location comparison uses the same indicator and overlapping complete years, but it does not perform a statistical test of the difference between the two slopes.
- TerraTrend does not forecast future conditions and should not be used alone for safety-critical decisions.

## Third-party sources

- NASA POWER: https://power.larc.nasa.gov/ — data source and documentation.
- Natural Earth: https://www.naturalearthdata.com/about/terms-of-use/ — public-domain map geometry.
- NASA is not affiliated with or endorsing TerraTrend.