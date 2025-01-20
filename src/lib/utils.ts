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

export function getStreetFromAddress(address: string) {
  return address.split(',')[0]
}

export function getRestAddress(a:string){
  const index = a.indexOf(", ");
  let b = ""
// If the pattern exists, update the string
if (index !== -1) {
    b = a.substring(index + 2); // Take everything after ", "
}
return b;
}