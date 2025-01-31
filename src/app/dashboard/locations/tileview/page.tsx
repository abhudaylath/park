"use client";
import { useEffect, useState } from "react";
import LocationCard from "./_components/location-card";
import { getRestAddress, getStreetFromAddress } from "@/lib/utils";
import { ParkingLocation } from "@/schemas/parking-locations";

const LocationsTileViewPage = () => {
  const [allLocations, setAllLocations] = useState<ParkingLocation[]>([]);
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger re-fetch

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/parkinglocation`
        );
        const result = await response.json();
        setAllLocations(result.location);        
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [refreshKey]); // Fetch when refreshKey changes

  const handleNewLocationAdded = () => {
    setRefreshKey((prev) => prev + 1); // This will trigger useEffect
  };

  return (
    <div>
      {/* Add this button or trigger it when adding a new location */}
      <button onClick={handleNewLocationAdded} className="flex-row-reverse p-2 bg-blue-500 text-white rounded justify-end">
        Refresh Locations
      </button>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-2 p-2">
        {allLocations?.map((location) => (
          <LocationCard
            key={location.id || location._id}
            id={location.id || location._id}
            name={getStreetFromAddress(location.address)}
            address={getRestAddress(location.address)}
            numberOfSpots={location.numberofspots}
            status={location.status}
            price={location.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationsTileViewPage;
