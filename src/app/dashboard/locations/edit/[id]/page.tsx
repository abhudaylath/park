import { ParkingLocation, ParkingLocationModel } from '@/schemas/parking-locations';
import React from 'react';
import LocationEditForm from './location-edit-form';

// Define the page component as a server component
export default async function LocationEditPage({
    params,
}: {
    params: { id: string }; // Properly type the `params` object
}) {
    const { id } = params;

    try {
        // Fetch location data on the server
        const location = await ParkingLocationModel.findById<ParkingLocation>(id);

        if (!location) {
            return <p>Location not found</p>;
        }

        return (
            <div>
                <h1>Edit Parking Location</h1>
                <LocationEditForm location={JSON.stringify(location)} id={id} />
            </div>
        );
    } catch (error) {
        console.error('Error fetching location:', error);
        return <p>Error loading location data</p>;
    }
}
