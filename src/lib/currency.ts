export type Currency = 'USD' | 'PEN';

/** Convierte un monto entre USD y PEN usando la tasa vigente (Soles por 1 Dólar). */
export const convertAmount = (amount: number, from: Currency, to: Currency, usdToPen: number): number => {
  if (from === to) return amount;
  return from === 'USD' ? amount * usdToPen : amount / usdToPen;
};
