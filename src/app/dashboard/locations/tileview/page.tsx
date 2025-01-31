"use client"
import { useEffect, useState } from 'react';
import LocationCard from './_components/location-card';
import { getRestAddress, getStreetFromAddress } from '@/lib/utils';
import {ParkingLocation} from '@/schemas/parking-locations'
const LocationsTileViewPage = () => {
  const [allLocations, setAllLocations] = useState<ParkingLocation[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/parkinglocation`);
        const result = await response.json();
        setAllLocations(result.location);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    
    fetchLocations();
  }, [allLocations]);

  return (
    <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-2 p-2'>
      {allLocations?.map((location) => (
        <LocationCard
          key={location.id || location._id}
          id={location.id}
          name={getStreetFromAddress(location.address)}
          address={getRestAddress(location.address)}
          numberOfSpots={location.numberofspots}
          status={location.status}
          price={location.price}
        />
      ))}
    </div>
  );
};

export default LocationsTileViewPage;
