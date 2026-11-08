# Terra Trend — Scientific Methods and Limitations

## Source
NASA POWER Monthly Point API, by latitude and longitude. Our selected indicators: 2 m air temperature T2M; corrected precipitation PRECTOTCORR; relative humidity at 2 m RH2M; wind speed at 10 m WS10M; and surface solar shortwave irradiance ALLSKY_SFC_SW_DWN. They are geospatially gridded datasets derived from models/observational analyses, not physical readings at every map click.

## Annual aggregation
Only years with 12 valid monthly records are counted. The valid range ignores invalid/missing values (including NASA missing sentinel). For mean-type variables, calculate an annual value as sum(month_value x number_of_days_in_month) / sum(days). For precipitation, annual mm = sum(monthly average precipitation rate in mm/day x days_in_month). Leap years use February 29 days.

## Trend estimation
Fit ordinary least squares to complete annual observations: y(year) = intercept + slope x year. Trend per decade = slope x 10. Fitted total change = slope x (last_year - first_year). A conventional two-sided Student-t test tests the hypothesis of slope = 0 and a t-based confidence interval provides 95% limits. p < 0.05 is labeled “Detected” by convention, not “certain” or “caused by climate change.”

## Limitations
Trend inference is sensitive to chosen years, completeness, serial correlation, outliers, variation in climate and data sources. Regression residuals may not be independent, so classical p-values and intervals may be optimistic. Comparing two trends is descriptive; the interface does not perform a statistical test of difference in slopes. No future projections or causality are claimed. Downloadable offline values are synthetic examples only.
