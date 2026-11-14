# TerraTrend — Methods, data provenance, and limitations

## NASA POWER source

TerraTrend uses the NASA POWER Monthly Point API at https://power.larc.nasa.gov/api/temporal/monthly/point. The application requests the RE (Renewable Energy) community for all five variables because this project uses NASA POWER's Monthly and Annual API. NASA documents RE as providing monthly and annual averaged solar and meteorological values; AG (Agroclimatology) is documented for daily mean time series. This keeps the request community aligned with the selected monthly temporal level. The original NASA request URL is available from each completed analysis.

NASA POWER provides gridded Earth-system estimates derived from satellite observations, atmospheric models, and reanalysis products. These are not physical readings from a weather station at every selected map coordinate. Resolution and source products vary by variable.

| Parameter | Meaning | Annual display |
| --- | --- | --- |
| T2M | 2 m air temperature | °C; calendar-day-weighted mean |
| PRECTOTCORR | Corrected precipitation mean daily rate | mm/year; monthly rate multiplied by days in month, then summed |
| RH2M | Relative humidity at 2 m | %; calendar-day-weighted mean |
| WS10M | Wind speed at 10 m | m/s; calendar-day-weighted mean |
| ALLSKY_SFC_SW_DWN | All-sky surface shortwave irradiance | kWh/m²/day; calendar-day-weighted mean |

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

## Cross-dataset interpretation

A fitted trend describes the selected NASA POWER parameter, source product, grid cell, and study period. It should not automatically be generalized to a city, district, division, or national climate trend. NASA POWER meteorological parameters in this application are derived from MERRA-2; the monthly API documentation identifies MERRA-2 as the meteorological source. Compare findings with independent gridded datasets and local station observations before making claims about observed local climate change.

For context, the World Bank Group's *Climate Risk Profile: Bangladesh* reports that its historical observed data use CRU TS v4.07 and ERA5, and reports a positive annual mean temperature trend for Sylhet division over 1971–2020. This is not a like-for-like comparison with a single NASA POWER/MERRA-2 grid point over 1990–2025: the source products, spatial aggregation, and study periods differ. The contrast is a reason to investigate data-product differences, not to replace one dataset's values with another's.

Further reading: [NASA POWER Monthly and Annual API](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/); [World Bank Climate Risk Profile: Bangladesh](https://climateknowledgeportal.worldbank.org/sites/default/files/country-profiles/16813-WB_Bangladesh%20Country%20Profile-WEB.pdf).


## Solar-series source boundary

NASA POWER's solar time series concatenates GEWEX SRB R4-IP data from 1984 through December 2000 with CERES SYN1deg data beginning in January 2001. NASA warns that the change in source products can introduce a step discontinuity that is not a physical climate signal and advises against assessing climate trends across this source change without careful assessment. TerraTrend therefore rejects a single solar trend period that crosses 2000–2001. For solar analysis, choose a period wholly within 1984–2000 or wholly within 2001 onward.

Solar parameters use a native global grid of approximately 1° latitude by 1° longitude. Meteorological parameters use a native grid of approximately 0.5° latitude by 0.625° longitude. The selected coordinates identify a gridded product location; they are not a point weather-station measurement.

NASA references:
- [Energy flux data sources and source-transition warning](https://power.larc.nasa.gov/docs/methodology/data/sources_fluxes/)
- [Meteorological data sources and native grid resolution](https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/)
- [NASA POWER user communities](https://power.larc.nasa.gov/docs/methodology/communities/)


### Precipitation monthly-rate conversion

NASA POWER's monthly precipitation output is a monthly mean daily rate in mm/day. TerraTrend converts it to annual accumulation by multiplying each month's mean daily rate by the number of calendar days in that month and summing the 12 monthly totals. This is not multiplying a monthly accumulation by days; the input is a daily rate. Leap years use 29 days in February. See NASA's [POWER monthly API documentation](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/) and NASA's [POWER precipitation explanation](https://appliedsciences.nasa.gov/sites/default/files/2021-07/Energy%20Management%20Q%26A%20Part%204.pdf).
