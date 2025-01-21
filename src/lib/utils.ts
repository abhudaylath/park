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



export const buildMapInfoCardContent = (title: string, address: string, totalSpots: number, price: number)
: string => {

  return `
    <div class="map_infocard_content">
      <div class="map_infocard_title">${title}</div>
      <div class="map_infocard_body">
      <div>${address}</div>
      <hr />
      <div>Total spots: ${totalSpots}</div>
      <div>Hourly price: ${formatAmountForDisplay(price, 'CAD')}</div>
      </div>
      
  </div>
  `
}


export const buildMapInfoCardContentForDestination = (title: string, address: string): string => {
  return `
  <div class="map_infocard_content">
      <div class="map_infocard_title">${title}</div>
      <div class="map_infocard_body">
      <div>${address}</div>
      </div>
      
  </div>`;
}



export const destinationPin = (type: string) => {
  const glyphImg = document.createElement('img');
  glyphImg.src = `http://localhost:3000/${type}.png`;
  const pinElement = new google.maps.marker.PinElement({
      glyph: glyphImg
  })

  return pinElement
}



export const parkingPin = (type: string) => {
  const glyphImg = document.createElement('div')
  glyphImg.innerHTML = `
    <div class="map_pin_container">
      <img src='http://localhost:3000/${type}.png' />
    </div>
  `

  const pinElement = new google.maps.marker.PinElement({
    glyph: glyphImg
  })

  return pinElement
}



export const parkingPinWithIndex = (type: string, index: number) => {
  const glyphImg = document.createElement('div')
  glyphImg.innerHTML = `
    <div class="map_pin_container">
      <div class="map_pin_id"><span>${index}</span></div>
      <img src='http://localhost:3000/${type}.png' />
    </div>
  `

  const pinElement = new google.maps.marker.PinElement({
    glyph: glyphImg
  })

  return pinElement
}





