/** Months since January 2001, used to place timeline bars. */
export function monthIndex(ym: string): number {
  const [y, m] = ym.split('-').map(Number);
  return (y! - 2001) * 12 + (m! - 1);
}
