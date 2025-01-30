import { ParkingLocation, ParkingLocationModel } from '@/schemas/parking-locations';
import React from 'react';
import LocationEditForm from './location-edit-form';

// Export a server-side component for fetching data
export default async function LocationEditPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;

    try {
        // Fetch location data
        const location = await ParkingLocationModel.findById<ParkingLocation>(id);

        if (!location) {
            // Render "not found" UI
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
