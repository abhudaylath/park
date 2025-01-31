'use client'

import React, { useState } from 'react'
import SearchForm from './search-form'
import { LatLng, MapAddressType, MapParams, ParkingLocationResponse } from '@/types'
import Map from './map'
import SearchResult from './search-result'
//import Map from './map'
//import SearchResult from './search-result'

export type SearchParams = {
  address: string,
  gpscoords: LatLng,
  arrivingon: Date,
  arrivingtime: string,
  leavingtime: string
}

function SearchComponent() {

  const [search, setSearch] = useState<MapParams[]>([])
  const [searchRadius, setSearchRadius] = useState(500)
  const [message, setMessage] = useState("Enter an address, date, time and click search")
  const [searchParams, setSearchParams] = useState<SearchParams | undefined>()


  const handleSearchDone = async (params: SearchParams) => {
    try {
      const { gpscoords, arrivingon, arrivingtime, leavingtime } = params;

      const arrivingOnISO = arrivingon.toISOString();

      const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/parking-locations`, window.location.origin); // Replace `window.location.origin` with the actual base URL if needed
      url.searchParams.append('lat', gpscoords.lat.toString());
      url.searchParams.append('lng', gpscoords.lng.toString());
      url.searchParams.append('arrivingon', arrivingOnISO);
      url.searchParams.append('arrivingtime', arrivingtime);
      url.searchParams.append('leavingtime', leavingtime);

      // Make the GET request using the Fetch API
      const response = await fetch(url.toString(), {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error fetching locations: ${response.statusText}`);
      }

      // Parse the JSON response
      const data = await response.json();
      
      const searchResult = data.locations;

      const mapParams: MapParams[] = searchResult.map((loc: ParkingLocationResponse) => ({
        address: loc._doc.address, // Access address inside _doc
        gpscoords: loc._doc.gpscoords, // Access gpscoords inside _doc
        price: loc._doc.price, // Access price inside _doc
        numberofspots: loc._doc.numberofspots, // Access number of spots
        bookedspots: loc.bookedspots, // Directly accessed from top level
        status: loc._doc.status, // Access status inside _doc
        type: MapAddressType.PARKINGLOCATION, // Fixed type
        id: loc._doc._id, // Access _id inside _doc
      }))

      if (mapParams.length > 0) {
        mapParams.unshift({
          address: params.address as string,
          gpscoords: params.gpscoords as LatLng,
          type: MapAddressType.DESTINATION,
          radius: searchRadius,
          id: ""
        })
        if(searchRadius%2==0){
          setSearchRadius(searchRadius+1)
        }else{
          setSearchRadius(searchRadius-1)
        }
        setSearch([...mapParams])
        setSearchParams(params)
        
      } else {
        setMessage("No nearby parking locations found.")
      }

      return data; // Return or process the data as needed
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Handle the error (e.g., show a toast notification or alert)
    }
  };

  return (
    <div className="flex-flex-col -mt-16 w-full p-4 py-10 item-start gap-x-2 rounded-2xl bg-gray-50 ring-1 ring-inset ring-gray-900/5">
      <SearchForm onSearch={handleSearchDone} />
      {
        search.length > 0 ?
          <div className="flex pt-10">
            <div className="p-1 m-4 w-72 overflow-auto h-[600px]">
            <SearchResult locations={search} params={searchParams as SearchParams} />
            </div>
            <div className="flex-1 ml-4">
            <Map mapParams={JSON.stringify(search)} />
            </div>
          </div>
          : <p className="text-center pt-12 pb-12 text-xl sm:text-4xl text-slate-700">{message}</p>
      }
    </div>
  )
}
export default SearchComponent