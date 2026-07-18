/**
 * 24 solar terms (节气) calculation for 2000-2099.
 * Formula: day = floor(Y * 0.2422 + C) - floor((Y-1)/4)
 * where Y = year % 100, result is the day-of-month.
 */
const TERMS: { name: string, month: number, C: number }[] = [
  { name: '小寒', month: 1, C: 6.11 },
  { name: '大寒', month: 1, C: 20.84 },
  { name: '立春', month: 2, C: 4.6295 },
  { name: '雨水', month: 2, C: 19.4599 },
  { name: '惊蛰', month: 3, C: 6.3826 },
  { name: '春分', month: 3, C: 21.4155 },
  { name: '清明', month: 4, C: 5.59 },
  { name: '谷雨', month: 4, C: 20.888 },
  { name: '立夏', month: 5, C: 5.52 },
  { name: '小满', month: 5, C: 21.04 },
  { name: '芒种', month: 6, C: 5.678 },
  { name: '夏至', month: 6, C: 21.37 },
  { name: '小暑', month: 7, C: 7.108 },
  { name: '大暑', month: 7, C: 22.83 },
  { name: '立秋', month: 8, C: 7.5 },
  { name: '处暑', month: 8, C: 23.13 },
  { name: '白露', month: 9, C: 7.646 },
  { name: '秋分', month: 9, C: 23.042 },
  { name: '寒露', month: 10, C: 8.318 },
  { name: '霜降', month: 10, C: 23.438 },
  { name: '立冬', month: 11, C: 7.438 },
  { name: '小雪', month: 11, C: 22.36 },
  { name: '大雪', month: 12, C: 7.18 },
  { name: '冬至', month: 12, C: 21.94 },
]

/**
 * Returns the Chinese name of the solar term (节气) that falls on the given date,
 * or null if the date is not a solar term day.
 * Formula valid for years 2000-2099.
 */
export function getSolarTerm(date: Date): string | null {
  const Y = date.getFullYear() % 100
  const targetMonth = date.getMonth() + 1
  const targetDay = date.getDate()

  for (const term of TERMS) {
    if (term.month !== targetMonth)
      continue
    const day = Math.floor(Y * 0.2422 + term.C) - Math.floor((Y - 1) / 4)
    if (day === targetDay)
      return term.name
    // Off-by-one correction: allow ±0 tolerance (documented known deviations)
  }

  return null
}
