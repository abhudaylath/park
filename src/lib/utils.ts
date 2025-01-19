import { Library } from "@googlemaps/js-api-loader"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const libs: Library[] = ['core', 'maps', 'places', 'marker']

export function formatAmountForDisplay(
  amount: number, currency: string
): string {

  const numberFormat = new Intl.NumberFormat(['en-IN'], {
    style:'currency',
    currency: currency,
    currencyDisplay: 'symbol'
  })

  const formatedAmount = numberFormat.format(amount)
  return formatedAmount === 'NaN' ? '' : formatedAmount
}
