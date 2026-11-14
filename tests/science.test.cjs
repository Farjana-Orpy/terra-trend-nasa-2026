'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../science.js');
const S = globalThis.TerraScience;

function payload(key, values) {
  return { header: { title: 'NASA POWER test fixture' }, properties: { parameter: { [key]: values } } };
}

test('day-weights monthly mean variables across leap-year months', () => {
  const months = {};
  for (let month = 1; month <= 12; month++) {
    months['2020' + String(month).padStart(2, '0')] = month === 2 ? 20 : 10;
  }
  const result = S.annualizeMonthly(payload('T2M', months), 'T2M', 2020, 2020);
  const expected = (337 * 10 + 29 * 20) / 366;
  assert.equal(result.annual.length, 1);
  assert.ok(Math.abs(result.annual[0].value - expected) < 1e-10);
  assert.equal(result.annual[0].completeMonths, 12);
});

test('converts monthly mean daily precipitation rates to annual totals', () => {
  const months = {};
  for (let month = 1; month <= 12; month++) {
    months['2020' + String(month).padStart(2, '0')] = 1;
  }
  const result = S.annualizeMonthly(payload('PRECTOTCORR', months), 'PRECTOTCORR', 2020, 2020);
  assert.equal(result.annual[0].value, 366);
  assert.equal(result.units, 'mm/year');
});

test('excludes years with a missing monthly record', () => {
  const months = {};
  for (let year = 2020; year <= 2021; year++) {
    for (let month = 1; month <= 12; month++) {
      if (!(year === 2021 && month === 7)) months[String(year) + String(month).padStart(2, '0')] = 25;
    }
  }
  const result = S.annualizeMonthly(payload('RH2M', months), 'RH2M', 2020, 2021);
  assert.deepEqual(result.annual.map(row => row.year), [2020]);
  assert.deepEqual(result.excluded, [{ year: 2021, completeMonths: 11 }]);
});

test('routes solar requests to RE and meteorological requests to AG', () => {
  const solar = new URL(S.powerUrl(24.89, 91.87, 2001, 2025, 'ALLSKY_SFC_SW_DWN'));
  const temperature = new URL(S.powerUrl(24.89, 91.87, 1990, 2025, 'T2M'));
  assert.equal(solar.searchParams.get('community'), 'RE');
  assert.equal(temperature.searchParams.get('community'), 'AG');
});

test('rejects solar trend periods that cross the 2001 source boundary', () => {
  assert.throws(() => S.validatePeriod('ALLSKY_SFC_SW_DWN', 1990, 2025), /source change in 2001/);
  assert.equal(S.validatePeriod('ALLSKY_SFC_SW_DWN', 1984, 2000), true);
  assert.equal(S.validatePeriod('ALLSKY_SFC_SW_DWN', 2001, 2025), true);
  assert.equal(S.validatePeriod('T2M', 1990, 2025), true);
});

test('recovers a known linear trend', () => {
  const points = [2000, 2001, 2002, 2003, 2004].map(year => ({ year, value: 10 + 0.1 * (year - 2000) }));
  const result = S.regress(points);
  assert.ok(Math.abs(result.slope - 0.1) < 1e-12);
  assert.equal(result.significant, true);
});
