# Terra Trend — Discover How Our Planet Is Changing

**Challenge:** NASA Space Apps Challenge 2026 — Be An Earth System Trend Detective!

**Problem.** Environmental change is hard to interpret because Earth-system variables change in different ways across locations and years, and visual trends alone can be misleading.

**Solution.** Terra Trend is a responsive interactive web application that helps users investigate trends in NASA POWER climate and energy variables. The user selects a place, variable and historical period; the app retrieves monthly NASA POWER estimates and converts complete calendar years into comparable annual values. It displays an annual time-series chart, an ordinary-least-squares trend line, the estimated change per decade, total change, a conventional two-sided significance test, a 95% confidence interval, and explanatory findings. The user can compare two places on the same measure and time span and export the data and a report.

**NASA data:** NASA POWER monthly point data (T2M, PRECTOTCORR, RH2M, WS10M, ALLSKY_SFC_SW_DWN): https://power.larc.nasa.gov/docs/services/api/temporal/monthly/

**Innovation and accessibility:** Terra Trend guides people without scientific expertise through the Earth-system trend questions: what is changing, where, how much, and whether the fitted linear trend is statistically distinguishable from zero. Clear provenance labels distinguish actual NASA data from the optional synthetic offline demonstration mode.

**Methods:** day-weighted annual means for temperature/humidity/wind/solar energy; annual precipitation obtained from monthly mean daily precipitation x days in month; incomplete years excluded; OLS fit and conventional two-sided t test on annual values; 95% confidence interval. Significance is conditional on assumptions (including residual independence); neither the trends nor the p-values prove causation. NASA POWER is gridded environmental data, not an on-site sensor reading for the exact map location.

**Deliverable:** standalone functional website, publishable static web files and source code.

**Disclaimer:** This project is not affiliated with or endorsed by NASA. Any example values in the offline demonstration mode are synthetic and not NASA measurements. Live API behavior must be tested at the final hosted URL before submission.

**Official challenge:** https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/
