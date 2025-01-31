import { connectToDB } from '@/lib/db'
import { ParkingLocation, ParkingLocationModel } from '@/schemas/parking-locations'
import React from 'react'
import LocationCard from './_components/location-card'
import { getRestAddress, getStreetFromAddress } from '@/lib/utils'

async function LocationsTileViewPage() {

  await connectToDB()
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/parkinglocation`)
  const result = await response.json()
  const allLocations: ParkingLocation[]  = result.location
  //const locations: ParkingLocation[] = await ParkingLocationModel.find({}) as [ParkingLocation]
  //console.log(allLocations);
  
  /*console.log("HI");
  console.log(locations);
  console.log("HI");*/
  return (
    <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-2 p-2'>
      {
        allLocations.map(location => (
          <LocationCard
            key={location.id}
            id={location.id}
              name={getStreetFromAddress(location.address)}
            address={getRestAddress(location.address)}
            numberOfSpots={location.numberofspots}
            status={location.status}
            price={location.price}
          />
        ))
      }
    </div>

  )
}

export default LocationsTileViewPage